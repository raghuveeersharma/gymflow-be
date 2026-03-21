import type { Request, Response } from 'express';
import { paymentsService } from './payments.service';
import { ApiResponse } from '../../shared/ApiResponse';

export const paymentsController = {
  async create(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.create(req.body, req.user!.userId);
    ApiResponse.success(res, payment, 'Payment recorded', 201);
  },

  async list(req: Request, res: Response): Promise<void> {
    const result = await paymentsService.list(req.user!.userId, req.query as Record<string, string>);
    ApiResponse.success(res, result.data, 'Payments retrieved', 200, result.meta);
  },

  async getByMember(req: Request, res: Response): Promise<void> {
    const payments = await paymentsService.getByMember(req.params.memberId as string, req.user!.userId);
    ApiResponse.success(res, payments, 'Member payments retrieved');
  },

  async update(req: Request, res: Response): Promise<void> {
    const payment = await paymentsService.update(req.params.id as string, req.user!.userId, req.body);
    ApiResponse.success(res, payment, 'Payment updated');
  },
};
