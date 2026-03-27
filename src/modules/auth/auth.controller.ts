import type { Request, Response } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../shared/ApiResponse';
import { env } from '../../config/env';

const isProduction = env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' as const : 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const { user, token } = await authService.register(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    ApiResponse.success(res, { user, token }, 'Registration successful', 201);
  },

  async login(req: Request, res: Response): Promise<void> {
    const { user, token } = await authService.login(req.body);
    res.cookie('token', token, COOKIE_OPTIONS);
    ApiResponse.success(res, { user, token }, 'Login successful');
  },

  async getMe(req: Request, res: Response): Promise<void> {
    const user = await authService.getMe(req.user!.userId);
    ApiResponse.success(res, user, 'User retrieved');
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token', { httpOnly: true, secure: isProduction, sameSite: isProduction ? 'none' as const : 'lax' as const });
    ApiResponse.success(res, undefined, 'Logged out successfully');
  },
};
