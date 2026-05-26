import { Request, Response, NextFunction } from 'express';
import { AdafruitService, DeviceKey } from './adafruit.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { BadRequestError } from '../../errors';

const adafruitService = new AdafruitService();

export class AdafruitController {

    // ── GET /adafruit/status ──────────────────────────────────────────────────
    async getAllStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adafruitService.getAllStatus();
            res.json(new ApiResponse(result, 'Get all device status successfully'));
        } catch (error) {
            next(error);
        }
    }

    // ── GET /adafruit/pump ────────────────────────────────────────────────────
    async getPumpStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adafruitService.getPumpStatus();
            res.json(new ApiResponse(result, 'Get pump status successfully'));
        } catch (error) {
            next(error);
        }
    }

    // ── GET /adafruit/fan ─────────────────────────────────────────────────────
    async getFanStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adafruitService.getFanStatus();
            res.json(new ApiResponse(result, 'Get fan status successfully'));
        } catch (error) {
            next(error);
        }
    }

    // ── GET /adafruit/settings ────────────────────────────────────────────────
    async getDeviceSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await adafruitService.getDeviceSettings();
            res.json(new ApiResponse(result, 'Get device settings successfully'));
        } catch (error) {
            next(error);
        }
    }

    // ── PUT /adafruit/pump  { "isOn": true | false } ──────────────────────────
    async controlPump(req: Request, res: Response, next: NextFunction) {
        try {
            const { isOn } = req.body;
            if (typeof isOn !== 'boolean') {
                throw new BadRequestError('Field "isOn" must be a boolean');
            }
            const result = await adafruitService.controlPump(isOn);
            res.json(new ApiResponse(result, `Pump turned ${isOn ? 'ON' : 'OFF'}`));
        } catch (error) {
            next(error);
        }
    }

    // ── PUT /adafruit/fan  { "isOn": true | false } ───────────────────────────
    async controlFan(req: Request, res: Response, next: NextFunction) {
        try {
            const { isOn } = req.body;
            if (typeof isOn !== 'boolean') {
                throw new BadRequestError('Field "isOn" must be a boolean');
            }
            const result = await adafruitService.controlFan(isOn);
            res.json(new ApiResponse(result, `Fan turned ${isOn ? 'ON' : 'OFF'}`));
        } catch (error) {
            next(error);
        }
    }

    // ── PUT /adafruit/:device/setting  { "value": 0-100 } ────────────────────
    async updateDeviceSetting(req: Request, res: Response, next: NextFunction) {
        try {
            const device = req.params.device as 'pump' | 'fan';
            const { value } = req.body;

            if (!['pump', 'fan'].includes(device)) {
                throw new BadRequestError(`Unknown device "${device}". Use "pump" or "fan"`);
            }
            if (typeof value !== 'number' || value < 0 || value > 100) {
                throw new BadRequestError('Field "value" must be a number between 0 and 100');
            }

            const result = await adafruitService.updateDeviceSetting(device, value);
            res.json(new ApiResponse(result, `${device} setting updated to ${value}`));
        } catch (error) {
            next(error);
        }
    }

    // ── PUT /adafruit/device/:device  { "isOn": true | false } ───────────────
    async controlDevice(req: Request, res: Response, next: NextFunction) {
        try {
            const device = req.params.device as DeviceKey;
            const { isOn } = req.body;

            if (!['pump', 'fan'].includes(device)) {
                throw new BadRequestError(`Unknown device "${device}". Use "pump" or "fan"`);
            }
            if (typeof isOn !== 'boolean') {
                throw new BadRequestError('Field "isOn" must be a boolean');
            }

            const result = await adafruitService.controlDevice(device, isOn);
            res.json(new ApiResponse(result, `${device} turned ${isOn ? 'ON' : 'OFF'}`));
        } catch (error) {
            next(error);
        }
    }

    // ── GET /adafruit/:device/logs?limit=20 ──────────────────────────────────
    async getDeviceLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const device = req.params.device as 'pump' | 'fan';
            if (!['pump', 'fan'].includes(device)) {
                throw new BadRequestError(`Unknown device "${device}". Use "pump" or "fan"`);
            }
            const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
            const result = await adafruitService.getDeviceLogs(device, limit);
            res.json(new ApiResponse(result, `Get ${device} logs successfully`));
        } catch (error) {
            next(error);
        }
    }
}
