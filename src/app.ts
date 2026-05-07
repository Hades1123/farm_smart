import express, { type Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { env } from './config/env';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 👉 Kích hoạt interceptor-like middleware ở đây (phải trước các routes)
// app.use(responseInterceptor);

app.get('/ping', (_req, res) => {
    res.json({ status: 'ok' });
});

// 👉 Cấu hình endpoint cho Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

// app.use(notFoundHandler);
app.use(errorHandler);

export default app;
