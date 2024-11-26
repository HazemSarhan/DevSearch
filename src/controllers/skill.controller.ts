import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
let prisma = new PrismaClient();
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors';

export const createSkill = async (req: Request, res: Response) => {
  const { name, description, userId } = req.body;
  if (!name || !userId) {
    throw new BadRequestError('Please provide all values');
  }

  const skill = await prisma.skills.create({
    data: {
      name,
      description,
      userId: req.body.userId,
    },
  });
  res.status(StatusCodes.CREATED).json({ skill });
};

export const getAllSkills = async (req: Request, res: Response) => {
  const skills = await prisma.skills.findMany();
  res.status(StatusCodes.OK).json({ skills });
};

export const getSkillById = async (req: Request, res: Response) => {
  const { id: skillId } = req.params;
  const skill = await prisma.skills.findUnique({
    where: {
      id: parseInt(skillId, 10),
    },
  });
  if (!skill) {
    throw new BadRequestError(`No skill with id ${skillId} found!`);
  }
  res.status(StatusCodes.OK).json({ skill });
};

export const updateSkill = async (req: Request, res: Response) => {
  const { id: skillId } = req.params;
  const { name, description } = req.body;
  const skill = await prisma.skills.update({
    where: {
      id: parseInt(skillId, 10),
    },
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.OK).json({ skill });
};

export const deleteSkill = async (req: Request, res: Response) => {
  const { id: skillId } = req.params;
  const skill = await prisma.skills.delete({
    where: {
      id: parseInt(skillId, 10),
    },
  });
  res.status(StatusCodes.OK).json({ skill });
};
