import type { Request, Response } from 'express';
import { plansService } from './plans.service';
import { ApiResponse } from '../../shared/ApiResponse';

export const plansController = {
  async create(req: Request, res: Response): Promise<void> {
    const plan = await plansService.create(req.body, req.user!.userId);
    ApiResponse.success(res, plan, 'Plan created', 201);
  },

  async list(req: Request, res: Response): Promise<void> {
    const plans = await plansService.list(req.user!.userId);
    ApiResponse.success(res, plans, 'Plans retrieved');
  },

  async update(req: Request, res: Response): Promise<void> {
    const plan = await plansService.update(req.params.id as string, req.user!.userId, req.body);
    ApiResponse.success(res, plan, 'Plan updated');
  },

  async delete(req: Request, res: Response): Promise<void> {
    await plansService.delete(req.params.id as string, req.user!.userId);
    ApiResponse.success(res, undefined, 'Plan deleted');
  },
};
