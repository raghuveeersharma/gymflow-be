import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { corsOptions } from './config/cors';
import { generalRateLimiter } from './config/rateLimiter';
import { morganStream } from './config/logger';
import { env } from './config/env';

import { healthRoutes } from './routes/health.routes';
import { v1Router } from './routes/index';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const app = express();

const sanitizeRequest = (req: Request, _res: Response, next: NextFunction): void => {
  // Express 5 exposes req.query as a getter-only property.
  // Sanitize in-place instead of reassigning req.query to avoid runtime errors.
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body as Record<string, unknown> | unknown[]);
  }

  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params as Record<string, unknown>);
  }

  if (req.query && typeof req.query === 'object') {
    mongoSanitize.sanitize(req.query as Record<string, unknown>);
  }

  if (req.headers && typeof req.headers === 'object') {
    mongoSanitize.sanitize(req.headers as Record<string, unknown>);
  }

  next();
};

// ─── Security middleware stack ───────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeRequest);
app.use(hpp());
app.use(generalRateLimiter);

// ─── Request logging ─────────────────────────────────────────────────────
const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, { stream: morganStream }));

// ─── Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1', healthRoutes);
app.use('/api/v1', v1Router);

// ─── Error handling ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
