import type { Request, Response } from 'express';
import { membersService } from './members.service';
import { ApiResponse } from '../../shared/ApiResponse';

export const membersController = {
  async create(req: Request, res: Response): Promise<void> {
    const member = await membersService.create(req.body, req.user!.userId);
    ApiResponse.success(res, member, 'Member created successfully', 201);
  },

  async list(req: Request, res: Response): Promise<void> {
    const result = await membersService.list(req.user!.userId, req.query as Record<string, string>);
    ApiResponse.success(res, result.data, 'Members retrieved', 200, result.meta);
  },

  async getById(req: Request, res: Response): Promise<void> {
    const member = await membersService.getById(req.params.id as string, req.user!.userId);
    ApiResponse.success(res, member, 'Member retrieved');
  },

  async update(req: Request, res: Response): Promise<void> {
    const member = await membersService.update(req.params.id as string, req.user!.userId, req.body);
    ApiResponse.success(res, member, 'Member updated');
  },

  async delete(req: Request, res: Response): Promise<void> {
    await membersService.delete(req.params.id as string, req.user!.userId);
    ApiResponse.success(res, undefined, 'Member deleted');
  },

  async search(req: Request, res: Response): Promise<void> {
    const q = req.query.q as string;
    const members = await membersService.search(req.user!.userId, q);
    ApiResponse.success(res, members, 'Search results');
  },

  async expiring(req: Request, res: Response): Promise<void> {
    const days = parseInt(req.query.days as string || '7', 10);
    const members = await membersService.getExpiring(req.user!.userId, days);
    ApiResponse.success(res, members, 'Expiring members');
  },
};
