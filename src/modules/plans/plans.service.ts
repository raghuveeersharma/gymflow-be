import { plansRepository } from './plans.repository';
import { membersRepository } from '../members/members.repository';
import type { CreatePlanDto, UpdatePlanDto } from './plans.types';
import { AppError } from '../../shared/AppError';
import { Member } from '../members/members.model';

export const plansService = {
  async create(data: CreatePlanDto, gymId: string) {
    return plansRepository.create({ ...data, gymId });
  },

  async list(gymId: string) {
    return plansRepository.findAllByGym(gymId);
  },

  async update(id: string, gymId: string, data: UpdatePlanDto) {
    const plan = await plansRepository.updateById(id, gymId, data);
    if (!plan) throw new AppError('Plan not found', 404);
    return plan;
  },

  async delete(id: string, gymId: string) {
    // Check if members use this plan
    const memberCount = await Member.countDocuments({ planId: id, gymId });
    if (memberCount > 0) {
      throw new AppError(`Cannot delete plan: ${memberCount} member(s) are using it`, 400);
    }
    const plan = await plansRepository.deleteById(id, gymId);
    if (!plan) throw new AppError('Plan not found', 404);
    return plan;
  },
};
