import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    // For GymFlow SaaS, all authenticated users are gym owners.
    // This middleware is kept for potential future role-based access.
    next();
  };
};
