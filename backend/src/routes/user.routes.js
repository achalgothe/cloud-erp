import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updatePermissions
} from '../controllers/user.controller.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(authorize('super_admin', 'admin', 'manager'), getUsers);

router.route('/:id')
  .get(getUserById)
  .put(authorize('super_admin', 'admin'), updateUser)
  .delete(authorize('super_admin', 'admin'), deleteUser);

router.put('/:id/permissions', authorize('super_admin', 'admin'), updatePermissions);

export default router;
