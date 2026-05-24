import http from 'http';
import app from './app';
import { env } from './config/env';
import { initPrisma, prisma } from './config/prisma';
import { initMqtt, closeMqtt } from './iot/mqtt.service';
import { initSocket, closeSocket } from './realtime/socket.service';
import { closeRedis, initRedis } from './config/redis';

const server = http.createServer(app);

const start = async (): Promise<void> => {
    await initPrisma();
    await initRedis();
    initMqtt();
    initSocket(server);

    server.listen(env.PORT, () => {
        console.log(`HTTP server listening on port ${env.PORT}`);
    });
};

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    console.log(`Received ${signal}, shutting down...`);
    await closeSocket();
    await closeMqtt(); // to connect to Adafruit IO
    await closeRedis();
    await prisma.$disconnect();

    server.close(() => {
        process.exit(0);
    });
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

start().catch((err: unknown) => {
    const error =
        err instanceof Error ? err : new Error('Unknown startup error');
    console.error('Startup failed', error);
    process.exit(1);
});
