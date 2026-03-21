import { Attendance } from './attendance.model';
import type { IAttendanceDocument } from './attendance.types';

export const attendanceRepository = {
  async create(data: Record<string, unknown>): Promise<IAttendanceDocument> {
    return Attendance.create(data);
  },

  async findByDate(gymId: string, startOfDay: Date, endOfDay: Date) {
    return Attendance.find({ gymId, date: { $gte: startOfDay, $lt: endOfDay } })
      .populate({ path: 'memberId', select: 'name phone' })
      .lean()
      .exec();
  },

  async findByMember(memberId: string, gymId: string) {
    return Attendance.find({ memberId, gymId })
      .sort({ date: -1 })
      .lean()
      .exec();
  },

  async upsert(gymId: string, memberId: string, date: Date, status: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Attendance.findOneAndUpdate(
      { gymId, memberId, date: { $gte: startOfDay, $lt: endOfDay } },
      { gymId, memberId, date, status },
      { upsert: true, new: true, runValidators: true },
    )
      .populate({ path: 'memberId', select: 'name phone' })
      .lean()
      .exec();
  },
};
