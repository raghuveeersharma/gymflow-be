import type { Document, Types } from 'mongoose';

export type AttendanceStatus = 'present' | 'absent';

export interface IAttendance {
  memberId: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  gymId: Types.ObjectId;
}

export interface IAttendanceDocument extends IAttendance, Document {
  _id: Types.ObjectId;
}

export interface MarkAttendanceDto {
  memberId: string;
  date?: string;
  status: AttendanceStatus;
}
