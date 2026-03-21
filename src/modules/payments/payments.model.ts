import mongoose, { Schema } from 'mongoose';
import type { IPaymentDocument } from './payments.types';

const paymentSchema = new Schema<IPaymentDocument>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    totalAmount: { type: Number, required: [true, 'Total amount is required'] },
    paidAmount: { type: Number, required: true, default: 0 },
    dueAmount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
    paymentDate: { type: Date, default: Date.now },
    gymId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

paymentSchema.index({ gymId: 1 });
paymentSchema.index({ gymId: 1, memberId: 1 });

export const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema);
