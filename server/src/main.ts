import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import parserRouter from './modules/parser/parser.routes.js';
import uploadRouter from './modules/upload/upload.route.js';
import { analysisRouter } from './modules/analysis/analysis.routes.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  }),
);

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, status: 'ok' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/parser', parserRouter);
app.use('/api/v1', analysisRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

app.listen(env.PORT, () => {
  console.info(`Server listening on port ${env.PORT}`);
});
