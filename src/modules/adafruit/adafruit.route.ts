import { Router } from 'express';
import { AdafruitController } from './adafruit.controller';

const router = Router();
const ctrl = new AdafruitController();

// ── READ ──────────────────────────────────────────────────────────────────────
router.get('/status',           ctrl.getAllStatus.bind(ctrl));
router.get('/pump',             ctrl.getPumpStatus.bind(ctrl));
router.get('/fan',              ctrl.getFanStatus.bind(ctrl));
router.get('/settings',         ctrl.getDeviceSettings.bind(ctrl));   // { pump: 55, fan: 55 }

// ── CONTROL (bật/tắt) ─────────────────────────────────────────────────────────
router.put('/pump',             ctrl.controlPump.bind(ctrl));          // { isOn: true }
router.put('/fan',              ctrl.controlFan.bind(ctrl));           // { isOn: false }
router.put('/device/:device',   ctrl.controlDevice.bind(ctrl));        // generic

// ── SETTINGS (ngưỡng 0-100) ───────────────────────────────────────────────────
router.put('/:device/setting',  ctrl.updateDeviceSetting.bind(ctrl)); // { value: 70 }

// ── LOGS (lịch sử hoạt động) ─────────────────────────────────────────────────
router.get('/:device/logs',     ctrl.getDeviceLogs.bind(ctrl));       // ?limit=20

export default router;
