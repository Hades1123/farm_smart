import dotenv from "dotenv";
dotenv.config();

export type NodeEnv = "development" | "test" | "production";

type Env = {
  PORT: number;
  NODE_ENV: NodeEnv;
  CORS_ORIGIN: string;
  MQTT_URL: string;
  MQTT_USERNAME?: string;
  MQTT_PASSWORD?: string;
  MQTT_SUBSCRIBE_TOPIC: string;
};

const parsePort = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

const parseNodeEnv = (): NodeEnv => {
  const value = process.env.NODE_ENV;
  if (value === "production" || value === "test" || value === "development")
    return value;
  return "development";
};

export const env: Env = {
  PORT: parsePort(process.env.PORT, 8000),
  NODE_ENV: parseNodeEnv(),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*",
  MQTT_URL: process.env.MQTT_URL ?? "mqtt://localhost:1883",
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
  MQTT_SUBSCRIBE_TOPIC:
    process.env.MQTT_SUBSCRIBE_TOPIC ?? "smartfarm/+/telemetry",
};
