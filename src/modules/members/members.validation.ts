import { z } from 'zod';

export const CreateMemberSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters').trim(),
  phone: z.string({ required_error: 'Phone is required' }).min(10, 'Phone must be at least 10 characters').trim(),
  planId: z.string({ required_error: 'Plan is required' }).min(1, 'Plan ID is required'),
  joinDate: z.string().optional(),
});

export const UpdateMemberSchema = z.object({
  name: z.string().min(2).trim().optional(),
  phone: z.string().min(10).trim().optional(),
  planId: z.string().min(1).optional(),
  joinDate: z.string().optional(),
});

export const MemberQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['active', 'expired']).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});

export const ExpiringQuerySchema = z.object({
  days: z.string().optional(),
});
