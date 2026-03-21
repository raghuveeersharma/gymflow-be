import { attendanceRepository } from './attendance.repository';
import type { MarkAttendanceDto } from './attendance.types';

export const attendanceService = {
  async mark(data: MarkAttendanceDto, gymId: string) {
    const date = data.date ? new Date(data.date) : new Date();
    return attendanceRepository.upsert(gymId, data.memberId, date, data.status);
  },

  async getByDate(gymId: string, dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return attendanceRepository.findByDate(gymId, startOfDay, endOfDay);
  },

  async getByMember(memberId: string, gymId: string) {
    return attendanceRepository.findByMember(memberId, gymId);
  },
};
