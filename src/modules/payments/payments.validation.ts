import { z } from 'zod';

export const CreatePaymentSchema = z.object({
  memberId: z.string({ required_error: 'Member ID is required' }).min(1, 'Member ID is required'),
  totalAmount: z.number({ required_error: 'Total amount is required' }).positive('Total amount must be positive'),
  paidAmount: z.number({ required_error: 'Paid amount is required' }).min(0, 'Paid amount cannot be negative'),
  paymentDate: z.string().optional(),
});

export const UpdatePaymentSchema = z.object({
  totalAmount: z.number().positive().optional(),
  paidAmount: z.number().min(0).optional(),
  paymentDate: z.string().optional(),
});

export const PaymentQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});
