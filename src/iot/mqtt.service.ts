import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import { SensorService } from '../modules/sensors/sensors.service';
import { getSocket } from '../realtime/socket.service';

const sensorService = new SensorService();

let client: MqttClient | null = null;

// Lazy getters để tránh env bị override khi module load
const getUsername = () => process.env.MQTT_USERNAME ?? '';
const getPassword = () => process.env.MQTT_PASSWORD ?? '';
const getMqttUrl  = () => process.env.MQTT_URL ?? 'mqtts://io.adafruit.com';

// ─── Feed → metadata map ──────────────────────────────────────────────────────
const SENSOR_FEEDS: Record<string, string> = {
    'dadn.humidity':     'humidity',
    'dadn.temperature':  'temperature',
    'dadn.soil-moisture':'soil',
    'dadn.light':        'light',
};

const DEVICE_FEEDS: Record<string, 'pump' | 'fan'> = {
    'dadn.pump-log': 'pump',
    'dadn.fan-log':  'fan',
};

// Tất cả feed cần subscribe
const ALL_FEED_KEYS = [
    ...Object.keys(SENSOR_FEEDS),
    ...Object.keys(DEVICE_FEEDS),
];

const buildOptions = (): IClientOptions => ({
    username: getUsername(),
    password: getPassword(),
    reconnectPeriod: 5_000,
});

export const initMqtt = (): MqttClient => {
    if (client) return client;

    const url = getMqttUrl();
    console.log(`Connecting MQTT to ${url}...`);
    client = mqtt.connect(url, buildOptions());

    client.on('connect', () => {
        console.log('✅ MQTT connected');

        const topics = ALL_FEED_KEYS.map((feed) => `${getUsername()}/feeds/${feed}`);

        client?.subscribe(topics, (err, granted) => {
            if (err) {
                console.error('MQTT subscribe failed', err);
            } else {
                console.log('Subscribed topics:', granted?.map((g) => g.topic).join(', '));
            }
        });
    });

    client.on('message', async (topic, payload) => {
        const value = payload.toString('utf-8');
        // Extract feed key: {username}/feeds/{feedKey}
        const parts = topic.split('/');
        const feedKey = parts.slice(2).join('/'); // handles dadn.xxx

        console.log(`[MQTT] ${topic} → ${value}`);

        // ── Sensor feed ───────────────────────────────────────────────────────
        const sensorType = SENSOR_FEEDS[feedKey];
        if (sensorType) {
            try {
                const result = await sensorService.saveSensorDataFromMqtt(topic, parseFloat(value));
                console.log(result.message);
            } catch (err) {
                console.error('Failed to save sensor data:', err);
            }

            // Emit to all connected FE clients
            try {
                getSocket().emit('sensor:update', {
                    type: sensorType,
                    value: parseFloat(value),
                    timestamp: new Date().toISOString(),
                });
            } catch { /* socket not yet ready */ }
        }

        // ── Device log feed ───────────────────────────────────────────────────
        const device = DEVICE_FEEDS[feedKey];
        if (device) {
            try {
                getSocket().emit('device:update', {
                    device,
                    value,
                    isOn: value !== '0',
                    timestamp: new Date().toISOString(),
                });
            } catch { /* socket not yet ready */ }
        }
    });

    client.on('error', (err) => {
        console.error('MQTT error', err.message);
    });

    client.on('reconnect', () => {
        console.log('MQTT reconnecting...');
    });

    return client;
};

export const getMqttClient = (): MqttClient => {
    if (!client) throw new Error('MQTT client has not been initialized');
    return client;
};

export const publishToFeed = async (feedKey: string, value: string): Promise<boolean> => {
    if (!client || !client.connected) {
        console.warn(`MQTT not connected – skipping publish to "${feedKey}"`);
        return false;
    }

    const topic = `${getUsername()}/feeds/${feedKey}`;

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
