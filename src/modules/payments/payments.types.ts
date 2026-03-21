import type { Document, Types } from 'mongoose';

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface IPayment {
  memberId: Types.ObjectId;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: PaymentStatus;
  paymentDate: Date;
  gymId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentDocument extends IPayment, Document {
  _id: Types.ObjectId;
}

export interface CreatePaymentDto {
  memberId: string;
  totalAmount: number;
  paidAmount: number;
  paymentDate?: string;
}

export interface UpdatePaymentDto {
  totalAmount?: number;
  paidAmount?: number;
  paymentDate?: string;
}
