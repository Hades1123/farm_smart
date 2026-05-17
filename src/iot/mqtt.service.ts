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

        const topics = env.MQTT_SUBSCRIBE_TOPICS.split(',');

        client?.subscribe(topics, (err, granted) => {
            if (err) {
                console.error('MQTT subscribe failed', err);
            } else {
                console.log('Subscribed topics:', granted);
            }
        });
    });

    client.on('message', (topic, payload) => {
        const message = payload.toString('utf-8');

        console.log('====================');
        console.log('Topic:', topic);
        console.log('Payload:', message);
        console.log('Time:', new Date().toISOString());
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

/**
 * Publish a value to an Adafruit IO feed via MQTT.
 * Topic format: {username}/feeds/{feedKey}
 * Returns true if published successfully, false otherwise.
 */
export const publishToFeed = async (
    feedKey: string,
    value: string,
): Promise<boolean> => {
    if (!client || !client.connected) {
        console.warn(`MQTT not connected – skipping publish to "${feedKey}"`);
        return false;
    }

    const topic = `${env.MQTT_USERNAME}/feeds/${feedKey}`;

    return new Promise<boolean>((resolve) => {
        client!.publish(topic, value, { qos: 1 }, (err) => {
            if (err) {
                console.error(`MQTT publish failed [${topic}]:`, err);
                resolve(false);
            } else {
                console.log(`MQTT published [${topic}]: ${value}`);
                resolve(true);
            }
        });
    });
};

export const closeMqtt = async (): Promise<void> => {
    if (!client) return;

    await new Promise<void>((resolve) => {
        client?.end(true, {}, () => resolve());
    });

    client = null;
};
