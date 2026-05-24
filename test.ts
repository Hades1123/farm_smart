import mqtt, { MqttClient } from 'mqtt';
import { env } from './src/config/env';

let subscriber: MqttClient | null = null;
let publisher: MqttClient | null = null;

// Client 1: Chỉ subscribe (lắng nghe)
const initSubscriber = () => {
    subscriber = mqtt.connect(env.MQTT_URL, {
        username: env.MQTT_USERNAME,
        password: env.MQTT_PASSWORD,
        clientId: `subscriber_${Date.now()}`
    });

    subscriber.on('connect', () => {
        console.log('📡 Subscriber connected');
        
        subscriber?.subscribe('kasgau/feeds/dadn.humidity', (err) => {
            if (err) {
                console.error('Subscribe error:', err);
            } else {
                console.log('✅ Subscriber listening to kasgau/feeds/dadn.humidity');
            }
        });

        subscriber?.subscribe('kasgau/feeds/dadn.temperature', (err) => {
            if (err) {
                console.error('Subscribe error:', err);
            } else {
                console.log('✅ Subscriber listening to kasgau/feeds/dadn.temperature');
            }
        });

        subscriber?.subscribe('kasgau/feeds/dadn.soil-moisture', (err) => {
            if (err) {
                console.error('Subscribe error:', err);
            } else {
                console.log('✅ Subscriber listening to kasgau/feeds/dadn.soil-moisture');
            }
        });

        subscriber?.subscribe('kasgau/feeds/dadn.light', (err) => {
            if (err) {
                console.error('Subscribe error:', err);
            } else {
                console.log('✅ Subscriber listening to kasgau/feeds/dadn.light');
            }
        });
    });

    subscriber.on('message', (topic, payload) => {
        console.log('🎉🎉🎉 MESSAGE RECEIVED! 🎉🎉🎉');
        console.log('Topic:', topic);
        console.log('Payload:', payload.toString());
        console.log('Time:', new Date().toISOString());
        console.log('====================');
    });
};

// Client 2: Chỉ publish (gửi dữ liệu)
const initPublisher = () => {
    publisher = mqtt.connect(env.MQTT_URL, {
        username: env.MQTT_USERNAME,
        password: env.MQTT_PASSWORD,
        clientId: `publisher_${Date.now()}`
    });

    publisher.on('connect', () => {
        console.log('✍️ Publisher connected');
        
        // Publish sau khi kết nối
        setTimeout(() => {
            const value = Math.floor(Math.random() * 100).toString();
            publisher?.publish('kasgau/feeds/dadn.humidity', value, { qos: 1 }, (err) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log(`📤 Published: ${value}`);
                }
            });
            const value1 = Math.floor(Math.random() * 100).toString();
            publisher?.publish('kasgau/feeds/dadn.temperature', value1, { qos: 1 }, (err) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log(`📤 Published: ${value1}`);
                }
            });
            const value2 = Math.floor(Math.random() * 100).toString();
            publisher?.publish('kasgau/feeds/dadn.soil-moisture', value2, { qos: 1 }, (err) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log(`📤 Published: ${value2}`);
                }
            });
            const value3 = Math.floor(Math.random() * 100).toString();
            publisher?.publish('kasgau/feeds/dadn.light', value3, { qos: 1 }, (err) => {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log(`📤 Published: ${value3}`);
                }
            });
        }, 3000);
    });
};

// Chạy test
console.log('🚀 Starting two-client test...');
initSubscriber();
initPublisher();