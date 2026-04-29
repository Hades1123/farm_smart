import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import { env } from '../config/env';

let client: MqttClient | null = null;

const buildOptions = (): IClientOptions => ({
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    reconnectPeriod: 5_000,
});

export const initMqtt = (): MqttClient => {
    if (client) return client;

    client = mqtt.connect(env.MQTT_URL, buildOptions());

    client.on('connect', () => {
        console.log('MQTT connected');
        client?.subscribe(env.MQTT_SUBSCRIBE_TOPIC, (err) => {
            if (err) {
                console.error('MQTT subscribe failed', err);
            } else {
                console.log(`MQTT subscribed to ${env.MQTT_SUBSCRIBE_TOPIC}`);
            }
        });
    });

    client.on('message', (topic, payload) => {
        const message = payload.toString('utf-8');
        console.log(`MQTT message on ${topic}: ${message}`);
    });

    client.on('error', (err) => {
        console.error('MQTT error', err);
    });

    return client;
};

export const getMqttClient = (): MqttClient => {
    if (!client) {
        throw new Error('MQTT client has not been initialized');
    }

    return client;
};

export const closeMqtt = async (): Promise<void> => {
    if (!client) return;

    await new Promise<void>((resolve) => {
        client?.end(true, {}, () => resolve());
    });

    client = null;
};
