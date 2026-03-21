import { Router } from 'express';
import { plansController } from './plans.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { CreatePlanSchema, UpdatePlanSchema } from './plans.validation';

const router = Router();
router.use(authenticate);

router.get('/', asyncHandler(plansController.list));
router.post('/', validate(CreatePlanSchema), asyncHandler(plansController.create));
router.put('/:id', validate(UpdatePlanSchema), asyncHandler(plansController.update));
router.delete('/:id', asyncHandler(plansController.delete));

export const plansRoutes = router;
