import { Router } from 'express';
import { DeviceController } from './device.controller';

const router = Router();
const deviceController = new DeviceController();

router.get('/', deviceController.getAllDevices);
router.post('/', deviceController.createDevice);
router.get('/:id', deviceController.getDeviceById);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

export default router;
