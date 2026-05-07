import { Router } from 'express';
import { UserController } from './users.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
const userController = new UserController();

router.patch('/me/password', userController.changePassword);
router.get('/me', userController.getUserMe);

export default router;