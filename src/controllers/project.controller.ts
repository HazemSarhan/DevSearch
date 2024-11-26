import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import cloudinary from '../configs/cloudinary.config';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { UserRole } from '../utils/checkPermissions';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, description, skills } = req.body;

    // Ensure the authenticated user's ID is available
    if (!req.user || !req.user.userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User not authenticated' });
      return;
    }

    const userId = req.user.userId;

    if (!name || !description || !skills) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: 'Please provide all required fields' });
      return;
    }

    // Handle image upload
    let projectImage: string;
    if (req.files && req.files.image) {
      const image = req.files.image as UploadedFile & { tempFilePath: string };
      const uploadResult = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
          use_filename: true,
          folder: 'projects-images',
        },
      );
      fs.unlinkSync(image.tempFilePath); // Remove temp file
      projectImage = uploadResult.secure_url;
    } else {
      projectImage = '/upload/default_project_image.jpg'; // Default image
    }

    // Convert skills to an array of IDs
    const skillIds = Array.isArray(skills)
      ? skills.map((id) => parseInt(id, 10))
      : [parseInt(skills, 10)];

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId,
        image: projectImage,
        skills: {
          connect: skillIds.map((id) => ({ id })),
        },
      },
    });

    res.status(StatusCodes.CREATED).json({ project });
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    include: { user: true, skills: true },
  });
  res.status(200).json(projects); // Return projects array directly
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const project = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId, 10),
    },
    include: {
      skills: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!project) {
    throw new BadRequestError(`No project with id ${projectId} found!`);
  }
  res.status(StatusCodes.OK).json({ project });
};

export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id: projectId } = req.params; // Get the project ID from the route parameters
    const { name, description, skills } = req.body;

    // Ensure the authenticated user's ID is available
    if (!req.user || !req.user.userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: 'User not authenticated' });
      return;
    }

    const userId = req.user.userId;

    // Check if the project exists and belongs to the authenticated user
    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(projectId, 10) },
      include: { skills: true },
    });

    if (!existingProject) {
      throw new NotFoundError(`Project with ID ${projectId} not found`);
    }

    if (existingProject.userId !== userId) {
      throw new UnauthorizedError(
        'You are not authorized to update this project',
      );
    }

    // Handle image upload if a new image is provided
    let projectImage = existingProject.image;
    if (req.files && req.files.image) {
      const image = req.files.image as UploadedFile & { tempFilePath: string };
      const uploadResult = await cloudinary.uploader.upload(
        image.tempFilePath,
        {
          use_filename: true,
          folder: 'projects-images',
        },
      );
      fs.unlinkSync(image.tempFilePath); // Remove temp file
      projectImage = uploadResult.secure_url;
    }

    // Convert skills to an array of IDs if provided
    const skillIds = skills
      ? Array.isArray(skills)
        ? skills.map((id) => parseInt(id, 10))
        : [parseInt(skills, 10)]
      : undefined;

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(projectId, 10) },
      data: {
        name: name || existingProject.name,
        description: description || existingProject.description,
        image: projectImage,
        skills: skillIds
          ? {
              set: skillIds.map((id) => ({ id })), // Replace current skills
            }
          : undefined, // No changes to skills if not provided
      },
    });

    res.status(StatusCodes.OK).json({ project: updatedProject });
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const project = await prisma.project.delete({
    where: {
      id: parseInt(projectId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ project });
};
