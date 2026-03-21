import { Router } from 'express';
import { authController } from './auth.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { RegisterSchema, LoginSchema } from './auth.validation';

const router = Router();

router.post('/register', validate(RegisterSchema), asyncHandler(authController.register));
router.post('/login', validate(LoginSchema), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.getMe));
router.post('/logout', asyncHandler(authController.logout));

export const authRoutes = router;
