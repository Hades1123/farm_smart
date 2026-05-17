import { Router } from 'express';
import { ControlController } from './control.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();
const controller = new ControlController();

// POST /api/control/pump    → Bật/tắt máy bơm
// POST /api/control/rgb     → Điều khiển đèn LED RGB
// POST /api/control/lcd     → Gửi nội dung lên màn hình LCD
// POST /api/control/fan     → (tương lai) Điều khiển quạt
router.post('/:type', authenticate, controller.execute);

// GET /api/control/pump/history?deviceId=...&page=1&limit=10
// GET /api/control/rgb/history?deviceId=...
// GET /api/control/lcd/history?deviceId=...
router.get('/:type/history', authenticate, controller.getHistory);

export default router;
