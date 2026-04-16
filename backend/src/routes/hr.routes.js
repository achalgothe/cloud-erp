import { Router } from 'express';
import { protect, checkPermission } from '../middleware/auth.middleware.js';
import {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  checkIn,
  checkOut,
  getAttendance,
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  getPayroll,
  generatePayroll
} from '../controllers/hr.controller.js';

const router = Router();

router.use(protect);

// Employee routes
router.route('/employees')
  .get(checkPermission('hr', 'view'), getEmployees)
  .post(checkPermission('hr', 'create'), createEmployee);

router.route('/employees/:id')
  .get(checkPermission('hr', 'view'), getEmployeeById)
  .put(checkPermission('hr', 'edit'), updateEmployee);

// Attendance routes
router.post('/attendance/check-in', checkIn);
router.post('/attendance/check-out', checkOut);
router.get('/attendance', checkPermission('hr', 'view'), getAttendance);

// Leave routes
router.route('/leave')
  .get(checkPermission('hr', 'view'), getLeaves)
  .post(applyLeave);

router.patch('/leave/:id', checkPermission('hr', 'edit'), updateLeaveStatus);

// Payroll routes
router.route('/payroll')
  .get(checkPermission('hr', 'view'), getPayroll)
  .post(checkPermission('hr', 'create'), generatePayroll);

export default router;
