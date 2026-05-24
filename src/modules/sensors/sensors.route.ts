import { Router } from 'express';
import { SensorController } from './sensors.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
router.use(authenticate);
const sensorController = new SensorController();

router.get('/threshold', sensorController.getSensorThreshold);
router.put('/threshold', sensorController.updateSensorThreshold);
router.post('/threshold/reset', sensorController.resetSensorThreshold);
router.get('/latest', sensorController.getLatestSensorData);
router.get('/history', sensorController.getSensorHistory);

export default router;