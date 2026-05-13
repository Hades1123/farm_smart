import dotenv from 'dotenv';
dotenv.config();

export type NodeEnv = 'development' | 'test' | 'production';

type Env = {
    PORT: number;
    NODE_ENV: NodeEnv;
    CORS_ORIGIN: string;
    MQTT_URL: string;
    MQTT_USERNAME?: string;
    MQTT_PASSWORD?: string;
    MQTT_SUBSCRIBE_TOPICS: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
};

const parsePort = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return fallback;
    return parsed;
};

const parseNodeEnv = (): NodeEnv => {
    const value = process.env.NODE_ENV;
    if (value === 'production' || value === 'test' || value === 'development')
        return value;
    return 'development';
};

const parseRequiredString = (key: string, fallback?: string): string => {
    const value = process.env[key];
    if (!value) {
        if (fallback) {
            console.warn(`${key} not set, using fallback: ${fallback}`);
            return fallback;
        }
        throw new Error(`Required environment variable ${key} is not set`);
    }
    return value;
};

export const env: Env = {
    PORT: parsePort(process.env.PORT, 8000),
    NODE_ENV: parseNodeEnv(),
    CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
    MQTT_URL: process.env.MQTT_URL ?? 'mqtt://localhost:1883',
    MQTT_USERNAME: process.env.MQTT_USERNAME,
    MQTT_PASSWORD: process.env.MQTT_PASSWORD,
    MQTT_SUBSCRIBE_TOPICS:
        process.env.MQTT_SUBSCRIBE_TOPICS ?? 'smartfarm/+/telemetry',
    JWT_ACCESS_SECRET: parseRequiredString('JWT_ACCESS_SECRET', process.env.NODE_ENV === 'development' ? 'dev-access-secret-change-me' : undefined),
    JWT_REFRESH_SECRET: parseRequiredString('JWT_REFRESH_SECRET', process.env.NODE_ENV === 'development' ? 'dev-refresh-secret-change-me' : undefined),
};
