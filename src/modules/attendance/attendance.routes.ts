import { Router } from 'express';
import { attendanceController } from './attendance.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { MarkAttendanceSchema, AttendanceQuerySchema } from './attendance.validation';

const router = Router();
router.use(authenticate);

router.post('/', validate(MarkAttendanceSchema), asyncHandler(attendanceController.mark));
router.get('/', validate(AttendanceQuerySchema, 'query'), asyncHandler(attendanceController.getByDate));
router.get('/member/:memberId', asyncHandler(attendanceController.getByMember));

export const attendanceRoutes = router;
