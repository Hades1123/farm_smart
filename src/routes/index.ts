import { Router } from 'express';
import exampleRoutes from '../modules/example/example.route';
import deviceRoutes from '../modules/devices/device.route';
import authRoutes from '../modules/auth/auth.route';
import userRoutes from '../modules/users/users.route';
import controlRoutes from '../modules/control/control.route';

const router = Router();

router.use('/example', exampleRoutes);
router.use('/devices', deviceRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/control', controlRoutes);

export default router;

