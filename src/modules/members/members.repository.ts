import { Member } from './members.model';
import type { IMemberDocument } from './members.types';
import type { FilterQuery, SortOrder } from 'mongoose';

export const membersRepository = {
  async create(data: Record<string, unknown>): Promise<IMemberDocument> {
    return Member.create(data);
  },

  async findAll(filter: FilterQuery<IMemberDocument>, skip: number, limit: number, sort: string, order: 'asc' | 'desc') {
    const sortOrder: SortOrder = order === 'asc' ? 1 : -1;
    return Member.find(filter).populate('planId').sort({ [sort]: sortOrder }).skip(skip).limit(limit).lean().exec();
  },

  async countAll(filter: FilterQuery<IMemberDocument>): Promise<number> {
    return Member.countDocuments(filter).exec();
  },

  async findById(id: string, gymId: string) {
    return Member.findOne({ _id: id, gymId }).populate('planId').lean().exec();
  },

  async updateById(id: string, gymId: string, data: Record<string, unknown>) {
    return Member.findOneAndUpdate({ _id: id, gymId }, data, { new: true, runValidators: true }).populate('planId').lean().exec();
  },

  async deleteById(id: string, gymId: string) {
    return Member.findOneAndDelete({ _id: id, gymId }).lean().exec();
  },

  async search(gymId: string, query: string) {
    return Member.find({
      gymId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
      ],
    }).populate('planId').lean().exec();
  },

  async findExpiring(gymId: string, startDate: Date, endDate: Date) {
    return Member.find({
      gymId,
      expiryDate: { $gte: startDate, $lte: endDate },
    }).populate('planId').lean().exec();
  },

  async countByGym(gymId: string): Promise<number> {
    return Member.countDocuments({ gymId }).exec();
  },

  async countActive(gymId: string, today: Date): Promise<number> {
    return Member.countDocuments({ gymId, expiryDate: { $gte: today } }).exec();
  },

  async countExpired(gymId: string, today: Date): Promise<number> {
    return Member.countDocuments({ gymId, expiryDate: { $lt: today } }).exec();
  },
};
