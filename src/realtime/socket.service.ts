import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
    if (io) return io;

    io = new SocketIOServer(server, {
        cors: {
            origin: env.CORS_ORIGIN,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.emit('welcome', { message: 'Connected to Smart Farm realtime' });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
};

export const getSocket = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io has not been initialized');
    }

    return io;
};

export const closeSocket = async (): Promise<void> => {
    if (!io) return;

    await new Promise<void>((resolve) => {
        io?.close(() => resolve());
    });

    io = null;
};
