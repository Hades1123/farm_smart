import { env } from '../../config/env';

const AIO_BASE_URL = 'https://io.adafruit.com/api/v2';
// Lazy getter để đọc đúng giá trị sau khi dotenv đã load
const getUsername = () => process.env.MQTT_USERNAME ?? '';
const getAioKey  = () => process.env.MQTT_PASSWORD ?? '';

// ─── Feed keys ────────────────────────────────────────────────────────────────
// Read (trạng thái thực tế) vs Control (lệnh bật/tắt)
const FEEDS = {
    pump: { read: 'dadn.pump-log', write: 'dadn.pump-trigger', setting: 'dadn.pump-setting' },
    fan:  { read: 'dadn.fan-log',  write: 'dadn.fan-trigger',  setting: 'dadn.fan-setting'  },
} as const;

export type DeviceKey = keyof typeof FEEDS;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface FeedStatus {
    feedKey: string;
    value: string;
    isOn: boolean;
    updatedAt: string;
}

export interface DeviceSettings {
    pump: number;  // 0-100
    fan: number;   // 0-100
}

export interface DeviceLogEntry {
    id: string;
    value: string;
    isOn: boolean;
    createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function aioGet<T>(path: string): Promise<T> {
    const res = await fetch(`${AIO_BASE_URL}/${getUsername()}${path}`, {
        headers: { 'X-AIO-Key': getAioKey(), 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`Adafruit IO [${res.status}]: ${await res.text()}`);
    return res.json() as Promise<T>;
}

async function aioPost<T>(path: string, body: object): Promise<T> {
    const res = await fetch(`${AIO_BASE_URL}/${getUsername()}${path}`, {
        method: 'POST',
        headers: { 'X-AIO-Key': getAioKey(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Adafruit IO [${res.status}]: ${await res.text()}`);
    return res.json() as Promise<T>;
}

// ─── Service ──────────────────────────────────────────────────────────────────
export class AdafruitService {

    // ── READ ──────────────────────────────────────────────────────────────────

    private async getFeedStatus(feedKey: string): Promise<FeedStatus> {
        const data = await aioGet<any>(`/feeds/${feedKey}/data/last`);
        return {
            feedKey,
            value: data.value,
            isOn: data.value !== '0',
            updatedAt: data.created_at,
        };
    }

    async getPumpStatus(): Promise<FeedStatus> {
        return this.getFeedStatus(FEEDS.pump.read);
    }

    async getFanStatus(): Promise<FeedStatus> {
        return this.getFeedStatus(FEEDS.fan.read);
    }

    async getAllStatus(): Promise<Record<DeviceKey, FeedStatus>> {
        const [pump, fan] = await Promise.all([
            this.getPumpStatus(),
            this.getFanStatus(),
        ]);
        return { pump, fan };
    }

    // ── WRITE ─────────────────────────────────────────────────────────────────

    private async setFeedValue(feedKey: string, value: '0' | '1'): Promise<FeedStatus> {
        const data = await aioPost<any>(`/feeds/${feedKey}/data`, { value });
        return {
            feedKey,
            value: data.value,
            isOn: data.value !== '0',
            updatedAt: data.created_at,
        };
    }

    async controlPump(isOn: boolean): Promise<FeedStatus> {
        return this.setFeedValue(FEEDS.pump.write, isOn ? '1' : '0');
    }

    async controlFan(isOn: boolean): Promise<FeedStatus> {
        return this.setFeedValue(FEEDS.fan.write, isOn ? '1' : '0');
    }

    async controlDevice(device: 'pump' | 'fan', isOn: boolean): Promise<FeedStatus> {
        return this.setFeedValue(FEEDS[device].write, isOn ? '1' : '0');
    }

    // ── SETTINGS (fan-setting / pump-setting) ─────────────────────────────────

    async getDeviceSettings(): Promise<DeviceSettings> {
        const [pumpData, fanData] = await Promise.all([
            aioGet<any>(`/feeds/${FEEDS.pump.setting}/data/last`),
            aioGet<any>(`/feeds/${FEEDS.fan.setting}/data/last`),
        ]);
        return {
            pump: parseFloat(pumpData.value) || 0,
            fan:  parseFloat(fanData.value)  || 0,
        };
    }

    async updateDeviceSetting(device: 'pump' | 'fan', value: number): Promise<{ device: string; value: number }> {
        const feedKey = FEEDS[device].setting;
        const clamped = Math.min(100, Math.max(0, Math.round(value)));
        await aioPost<any>(`/feeds/${feedKey}/data`, { value: clamped.toString() });
        return { device, value: clamped };
    }

    // ── LOGS (fan-log / pump-log) ──────────────────────────────────────────────

    async getDeviceLogs(device: 'pump' | 'fan', limit = 20): Promise<DeviceLogEntry[]> {
        const feedKey = FEEDS[device].read;
        const data = await aioGet<any[]>(`/feeds/${feedKey}/data?limit=${limit}`);
        return data.map((entry) => ({
            id: entry.id,
            value: entry.value,
            isOn: entry.value !== '0',
            createdAt: entry.created_at,
        }));
    }
}
