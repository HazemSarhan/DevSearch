import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserPassword,
  updateUserRole,
  deleteUser,
  getCurrentUser,
} from '../controllers/user.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';
const userRoutes = express.Router();

userRoutes.route('/').get(getAllUsers);
userRoutes
  .route('/current-user')
  .get(
    authenticatedUser as express.RequestHandler,
    getCurrentUser as express.RequestHandler,
  );

userRoutes
  .route('/:id/updatePassword')
  .patch([authenticatedUser], updateUserPassword);
userRoutes
  .route('/:id/updateRole')
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateUserRole);
userRoutes
  .route('/:id')
  .get(getUserById)
  .patch([authenticatedUser], updateUserData)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteUser);

export default userRoutes;
