import { Router } from 'express';
import exampleRoutes from '../modules/example/example.route';
import deviceRoutes from '../modules/devices/device.route';

const router = Router();

router.use('/example', exampleRoutes);
router.use('/devices', deviceRoutes);

export default router;
