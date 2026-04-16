import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { loginValidation, registerValidation } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
