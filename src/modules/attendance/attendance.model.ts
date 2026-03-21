import mongoose, { Schema } from 'mongoose';
import type { IAttendanceDocument } from './attendance.types';

const attendanceSchema = new Schema<IAttendanceDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent'], default: 'present' },
    gymId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

attendanceSchema.index({ gymId: 1, date: 1 });

export const Attendance = mongoose.model<IAttendanceDocument>('Attendance', attendanceSchema);
