import { createClient } from 'redis';
import { env } from "./env"

const client = createClient({
    url: env.REDIS_URL,
});

client.on('error', (err) => console.log('Redis Client Error', err));

export const initRedis = async (): Promise<void> => {
    await client.connect();
    console.log('Connected to Redis');
};

export const getRedisClient = () => {
    if (!client.isOpen) {
        throw new Error('Redis client is not connected');
    }
    return client;
};

export const closeRedis = async (): Promise<void> => {
    await client.quit();
    console.log('Redis connection closed');
};