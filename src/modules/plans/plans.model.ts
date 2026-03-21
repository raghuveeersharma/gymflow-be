import mongoose, { Schema } from 'mongoose';
import type { IPlanDocument } from './plans.types';

const planSchema = new Schema<IPlanDocument>(
  {
    name: { type: String, required: [true, 'Plan name is required'], trim: true },
    duration: { type: Number, required: [true, 'Duration is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    gymId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

planSchema.index({ gymId: 1 });

export const Plan = mongoose.model<IPlanDocument>('Plan', planSchema);
