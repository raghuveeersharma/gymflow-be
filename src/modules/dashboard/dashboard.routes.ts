import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(dashboardController.get));

export const dashboardRoutes = router;
