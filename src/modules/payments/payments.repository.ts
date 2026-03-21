import { Payment } from './payments.model';
import type { IPaymentDocument } from './payments.types';
import type { FilterQuery, SortOrder } from 'mongoose';
import mongoose from 'mongoose';

export const paymentsRepository = {
  async create(data: Record<string, unknown>): Promise<IPaymentDocument> {
    return Payment.create(data);
  },

  async findAll(filter: FilterQuery<IPaymentDocument>, skip: number, limit: number) {
    return Payment.find(filter)
      .populate({ path: 'memberId', select: 'name phone' })
      .sort({ createdAt: -1 as SortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  },

  async countAll(filter: FilterQuery<IPaymentDocument>): Promise<number> {
    return Payment.countDocuments(filter).exec();
  },

  async findByMember(memberId: string, gymId: string) {
    return Payment.find({ memberId, gymId })
      .populate({ path: 'memberId', select: 'name phone' })
      .sort({ createdAt: -1 as SortOrder })
      .lean()
      .exec();
  },

  async findById(id: string, gymId: string) {
    return Payment.findOne({ _id: id, gymId })
      .populate({ path: 'memberId', select: 'name phone' })
      .lean()
      .exec();
  },

  async updateById(id: string, gymId: string, data: Record<string, unknown>) {
    return Payment.findOneAndUpdate({ _id: id, gymId }, data, { new: true, runValidators: true })
      .populate({ path: 'memberId', select: 'name phone' })
      .lean()
      .exec();
  },

  async deleteByMember(memberId: string, gymId: string) {
    return Payment.deleteMany({ memberId, gymId }).exec();
  },

  async getMonthlyRevenue(gymId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await Payment.aggregate([
      { $match: { gymId: new mongoose.Types.ObjectId(gymId), paymentDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);
    return result.length > 0 ? (result[0] as { total: number }).total : 0;
  },

  async getRecent(gymId: string, limit: number) {
    return Payment.find({ gymId })
      .populate({ path: 'memberId', select: 'name phone' })
      .sort({ createdAt: -1 as SortOrder })
      .limit(limit)
      .lean()
      .exec();
  },
};
