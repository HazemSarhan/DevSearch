import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const projectRoutes = express.Router();

projectRoutes
  .route('/')
  .post([authenticatedUser], createProject)
  .get(getAllProjects);
projectRoutes
  .route('/:id')
  .get(getProjectById)
  .patch([authenticatedUser], updateProject)
  .delete([authenticatedUser], deleteProject);
export default projectRoutes;
