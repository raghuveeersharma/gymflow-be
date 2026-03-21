import mongoose, { Schema } from 'mongoose';
import type { IMemberDocument } from './members.types';

const memberSchema = new Schema<IMemberDocument>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
    joinDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
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

memberSchema.index({ gymId: 1 });
memberSchema.index({ gymId: 1, expiryDate: 1 });

export const Member = mongoose.model<IMemberDocument>('Member', memberSchema);
