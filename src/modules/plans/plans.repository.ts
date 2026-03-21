import { Plan } from './plans.model';
import type { IPlanDocument, CreatePlanDto, UpdatePlanDto } from './plans.types';

export const plansRepository = {
  async create(data: CreatePlanDto & { gymId: string }): Promise<IPlanDocument> {
    return Plan.create(data);
  },

  async findAllByGym(gymId: string) {
    return Plan.find({ gymId }).lean().exec();
  },

  async findById(id: string, gymId: string) {
    return Plan.findOne({ _id: id, gymId }).lean().exec();
  },

  async updateById(id: string, gymId: string, data: UpdatePlanDto) {
    return Plan.findOneAndUpdate({ _id: id, gymId }, data, { new: true, runValidators: true }).lean().exec();
  },

  async deleteById(id: string, gymId: string) {
    return Plan.findOneAndDelete({ _id: id, gymId }).lean().exec();
  },
};
