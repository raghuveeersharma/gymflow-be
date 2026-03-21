import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError('Resource not found', 404));
};
