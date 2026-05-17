import { BadRequestError } from '../../errors';
import type { IDeviceControlStrategy } from './strategies/device-control.interface';
import { PumpStrategy } from './strategies/pump.strategy';
import { RGBStrategy } from './strategies/rgb.strategy';
import { LCDStrategy } from './strategies/lcd.strategy';

class ControlRegistry {
    private strategies = new Map<string, IDeviceControlStrategy>();

    register(key: string, strategy: IDeviceControlStrategy): void {
        this.strategies.set(key, strategy);
    }

    get(key: string): IDeviceControlStrategy {
        const strategy = this.strategies.get(key);
        if (!strategy) {
            throw new BadRequestError(
                `Unsupported control type: "${key}". Available: ${this.getRegisteredTypes().join(', ')}`,
            );
        }
        return strategy;
    }

    getRegisteredTypes(): string[] {
        return Array.from(this.strategies.keys());
    }
}

// ─── Singleton Registry ───────────────────────────────────────
const registry = new ControlRegistry();

registry.register('pump', new PumpStrategy());
registry.register('rgb', new RGBStrategy());
registry.register('lcd', new LCDStrategy());

// ✅ Thêm thiết bị mới? Chỉ cần:
// 1. Tạo file fan.strategy.ts implement IDeviceControlStrategy
// 2. registry.register('fan', new FanStrategy());

export default registry;
