import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';
import { logger } from '../config/logger';
import { env } from '../config/env';

interface ErrorWithErrors extends AppError {
  errors?: Array<{ field: string; message: string }>;
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    const errorResponse = err as ErrorWithErrors;

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(errorResponse.errors && { errors: errorResponse.errors }),
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    name: err.name,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
