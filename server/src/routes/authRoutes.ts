import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { loginValidator, registerValidator } from '../validators/authValidator';
import { validateRequest } from '../middleware/validate';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public auth routes
router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);

// Protected auth routes
router.get('/me', authenticateToken as any, getMe as any);

export default router;
