import { z } from 'zod';

export const MarkAttendanceSchema = z.object({
  memberId: z.string({ required_error: 'Member ID is required' }).min(1),
  date: z.string().optional(),
  status: z.enum(['present', 'absent']).default('present'),
});

export const AttendanceQuerySchema = z.object({
  date: z.string().optional(),
});
