import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters').trim(),
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  gymName: z.string({ required_error: 'Gym name is required' }).min(2, 'Gym name must be at least 2 characters').trim(),
  phone: z.string({ required_error: 'Phone is required' }).min(10, 'Phone must be at least 10 characters').trim(),
});

export const LoginSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Invalid email address').toLowerCase().trim(),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});
