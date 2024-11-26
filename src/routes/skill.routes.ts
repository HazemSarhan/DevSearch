import express from 'express';
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../controllers/skill.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';

const skillRoutes = express.Router();

skillRoutes.route('/').get(getAllSkills).post([authenticatedUser], createSkill);
skillRoutes
  .route('/:id')
  .get(getSkillById)
  .patch([authenticatedUser], updateSkill)
  .delete([authenticatedUser], deleteSkill);

export default skillRoutes;
