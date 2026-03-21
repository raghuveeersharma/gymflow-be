import type { Request, Response } from 'express';
import { attendanceService } from './attendance.service';
import { ApiResponse } from '../../shared/ApiResponse';

export const attendanceController = {
  async mark(req: Request, res: Response): Promise<void> {
    const attendance = await attendanceService.mark(req.body, req.user!.userId);
    ApiResponse.success(res, attendance, 'Attendance marked', 201);
  },

  async getByDate(req: Request, res: Response): Promise<void> {
    const records = await attendanceService.getByDate(req.user!.userId, req.query.date as string | undefined);
    ApiResponse.success(res, records, 'Attendance retrieved');
  },

  async getByMember(req: Request, res: Response): Promise<void> {
    const records = await attendanceService.getByMember(req.params.memberId as string, req.user!.userId);
    ApiResponse.success(res, records, 'Member attendance retrieved');
  },
};
