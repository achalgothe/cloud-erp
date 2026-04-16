import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getCompanies,
  getCompanyById,
  getMyCompany,
  createCompany,
  updateCompany,
  updateSettings,
  deleteCompany
} from '../controllers/company.controller.js';

const router = Router();

router.use(protect);

router.route('/')
  .get(authorize('super_admin', 'admin'), getCompanies)
  .post(authorize('super_admin', 'admin'), createCompany);

router.get('/me/company', getMyCompany);

router.route('/:id')
  .get(getCompanyById)
  .put(authorize('super_admin', 'admin'), updateCompany)
  .delete(authorize('super_admin', 'admin'), deleteCompany);

router.put('/:id/settings', authorize('super_admin', 'admin'), updateSettings);

export default router;
