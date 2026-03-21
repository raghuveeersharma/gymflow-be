import { paymentsRepository } from './payments.repository';
import type { CreatePaymentDto, UpdatePaymentDto, PaymentStatus } from './payments.types';
import { AppError } from '../../shared/AppError';
import { parsePagination, buildPaginatedResponse } from '../../shared/pagination';

const calcStatus = (totalAmount: number, paidAmount: number): { status: PaymentStatus; dueAmount: number } => {
  const dueAmount = totalAmount - paidAmount;
  let status: PaymentStatus = 'unpaid';
  if (paidAmount >= totalAmount) status = 'paid';
  else if (paidAmount > 0) status = 'partial';
  return { status, dueAmount };
};

export const paymentsService = {
  async create(data: CreatePaymentDto, gymId: string) {
    const { status, dueAmount } = calcStatus(data.totalAmount, data.paidAmount);
    return paymentsRepository.create({
      memberId: data.memberId,
      totalAmount: data.totalAmount,
      paidAmount: data.paidAmount,
      dueAmount,
      status,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
      gymId,
    });
  },

  async list(gymId: string, query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const filter = { gymId };
    const [payments, total] = await Promise.all([
      paymentsRepository.findAll(filter, skip, limit),
      paymentsRepository.countAll(filter),
    ]);
    return buildPaginatedResponse(payments, total, page, limit);
  },

  async getByMember(memberId: string, gymId: string) {
    return paymentsRepository.findByMember(memberId, gymId);
  },

  async update(id: string, gymId: string, data: UpdatePaymentDto) {
    const existing = await paymentsRepository.findById(id, gymId);
    if (!existing) throw new AppError('Payment not found', 404);

    const totalAmount = data.totalAmount ?? existing.totalAmount;
    const paidAmount = data.paidAmount ?? existing.paidAmount;
    const { status, dueAmount } = calcStatus(totalAmount, paidAmount);

    const updateData: Record<string, unknown> = {
      ...data,
      dueAmount,
      status,
    };
    if (data.paymentDate) updateData.paymentDate = new Date(data.paymentDate);

    const payment = await paymentsRepository.updateById(id, gymId, updateData);
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  },
};
