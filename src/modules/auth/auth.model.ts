import mongoose, { Schema } from 'mongoose';
import type { IUserDocument } from './auth.types';

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    gymName: { type: String, required: [true, 'Gym name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone is required'], trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUserDocument>('User', userSchema);
