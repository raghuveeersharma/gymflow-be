import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { CreatePaymentSchema, UpdatePaymentSchema, PaymentQuerySchema } from './payments.validation';

const router = Router();
router.use(authenticate);

router.get('/', validate(PaymentQuerySchema, 'query'), asyncHandler(paymentsController.list));
router.post('/', validate(CreatePaymentSchema), asyncHandler(paymentsController.create));
router.get('/member/:memberId', asyncHandler(paymentsController.getByMember));
router.put('/:id', validate(UpdatePaymentSchema), asyncHandler(paymentsController.update));

export const paymentsRoutes = router;
