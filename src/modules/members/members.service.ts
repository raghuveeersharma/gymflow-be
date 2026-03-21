import { membersRepository } from './members.repository';
import { plansRepository } from '../plans/plans.repository';
import { paymentsRepository } from '../payments/payments.repository';
import type { CreateMemberDto, UpdateMemberDto, IMemberDocument } from './members.types';
import type { FilterQuery } from 'mongoose';
import { AppError } from '../../shared/AppError';
import { parsePagination, buildPaginatedResponse } from '../../shared/pagination';

const getToday = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const membersService = {
  async create(data: CreateMemberDto, gymId: string) {
    const plan = await plansRepository.findById(data.planId, gymId);
    if (!plan) throw new AppError('Plan not found', 404);

    const joinDate = data.joinDate ? new Date(data.joinDate) : new Date();
    const expiryDate = new Date(joinDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);

    return membersRepository.create({ name: data.name, phone: data.phone, planId: data.planId, joinDate, expiryDate, gymId });
  },

  async list(gymId: string, query: { page?: string; limit?: string; status?: string; sort?: string; order?: string }) {
    const { page, limit, skip, sort, order } = parsePagination(query);
    const filter: FilterQuery<IMemberDocument> = { gymId };
    const today = getToday();

    if (query.status === 'active') filter.expiryDate = { $gte: today };
    else if (query.status === 'expired') filter.expiryDate = { $lt: today };

    const [members, total] = await Promise.all([
      membersRepository.findAll(filter, skip, limit, sort || 'createdAt', order),
      membersRepository.countAll(filter),
    ]);
    return buildPaginatedResponse(members, total, page, limit);
  },

  async getById(id: string, gymId: string) {
    const member = await membersRepository.findById(id, gymId);
    if (!member) throw new AppError('Member not found', 404);
    return member;
  },

  async update(id: string, gymId: string, data: UpdateMemberDto) {
    const updateData: Record<string, unknown> = { ...data };

    if (data.planId || data.joinDate) {
      const existing = await membersRepository.findById(id, gymId);
      if (!existing) throw new AppError('Member not found', 404);

      const planId = data.planId || existing.planId?.toString();
      const plan = await plansRepository.findById(planId as string, gymId);
      if (!plan) throw new AppError('Plan not found', 404);

      const joinDate = data.joinDate ? new Date(data.joinDate) : existing.joinDate;
      const expiryDate = new Date(new Date(joinDate).getTime() + plan.duration * 24 * 60 * 60 * 1000);
      updateData.expiryDate = expiryDate;
      if (data.joinDate) updateData.joinDate = joinDate;
    }

    const member = await membersRepository.updateById(id, gymId, updateData);
    if (!member) throw new AppError('Member not found', 404);
    return member;
  },

  async delete(id: string, gymId: string) {
    const member = await membersRepository.deleteById(id, gymId);
    if (!member) throw new AppError('Member not found', 404);
    // Cascade delete payments
    await paymentsRepository.deleteByMember(id, gymId);
    return member;
  },

  async search(gymId: string, q: string) {
    return membersRepository.search(gymId, q);
  },

  async getExpiring(gymId: string, days: number) {
    const today = getToday();
    const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return membersRepository.findExpiring(gymId, today, endDate);
  },
};
