import { DeviceType } from '@prisma/client';

// ─── Shared Types ─────────────────────────────────────────────

export interface PaginationQuery {
    page: number;
    limit: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ControlResult {
    record: unknown;
    mqttPublished: boolean;
}

// ─── Strategy Interface ───────────────────────────────────────

export interface IDeviceControlStrategy {
    /** Prisma DeviceType mà strategy này xử lý */
    readonly deviceType: DeviceType;

    /** Tên feed trên Adafruit IO (vd: 'pumper', 'led'). Null nếu không có feed */
    readonly mqttFeed: string | null;

    /** Thực thi lệnh điều khiển: lưu DB + publish MQTT */
    execute(deviceId: string, payload: unknown): Promise<ControlResult>;

    /** Lấy lịch sử điều khiển có phân trang */
    getHistory(
        deviceId: string,
        query: PaginationQuery,
    ): Promise<PaginatedResult<unknown>>;

    /** Chuyển payload thành giá trị string để gửi qua MQTT */
    formatMqttValue(payload: unknown): string;
}
