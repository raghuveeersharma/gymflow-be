import { Router } from 'express';
import { membersController } from './members.controller';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { CreateMemberSchema, UpdateMemberSchema, MemberQuerySchema } from './members.validation';

const router = Router();

router.use(authenticate);

router.get('/', validate(MemberQuerySchema, 'query'), asyncHandler(membersController.list));
router.post('/', validate(CreateMemberSchema), asyncHandler(membersController.create));
router.get('/search', asyncHandler(membersController.search));
router.get('/expiring', asyncHandler(membersController.expiring));
router.get('/:id', asyncHandler(membersController.getById));
router.put('/:id', validate(UpdateMemberSchema), asyncHandler(membersController.update));
router.delete('/:id', asyncHandler(membersController.delete));

export const membersRoutes = router;
