import { z } from 'zod';

export const CreatePlanSchema = z.object({
  name: z.string({ required_error: 'Plan name is required' }).min(1, 'Plan name is required').trim(),
  duration: z.number({ required_error: 'Duration is required' }).int().positive('Duration must be positive'),
  price: z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
});

export const UpdatePlanSchema = z.object({
  name: z.string().min(1).trim().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
});
