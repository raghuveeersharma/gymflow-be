import type { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { ApiResponse } from '../../shared/ApiResponse';

export const dashboardController = {
  async get(req: Request, res: Response): Promise<void> {
    const data = await dashboardService.getDashboard(req.user!.userId);
    ApiResponse.success(res, data, 'Dashboard data retrieved');
  },
};
