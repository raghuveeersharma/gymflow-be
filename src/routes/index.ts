import { Router } from 'express';
import { authRoutes } from '../modules/auth';
import { membersRoutes } from '../modules/members';
import { plansRoutes } from '../modules/plans';
import { paymentsRoutes } from '../modules/payments';
import { dashboardRoutes } from '../modules/dashboard';
import { attendanceRoutes } from '../modules/attendance';
import { routeCatalogRoutes } from './routeCatalog.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/members', membersRoutes);
router.use('/plans', plansRoutes);
router.use('/payments', paymentsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/meta', routeCatalogRoutes);

export const v1Router = router;
