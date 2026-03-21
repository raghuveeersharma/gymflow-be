import type { Request, Response, NextFunction } from 'express';
import { tokenService } from '../shared/tokenService';
import { AppError } from '../shared/AppError';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies) {
    token = req.cookies.token as string | undefined;
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  try {
    const decoded = tokenService.verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Invalid or expired token. Please log in again.', 401);
  }
};
