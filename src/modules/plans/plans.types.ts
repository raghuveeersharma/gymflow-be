import type { Document, Types } from 'mongoose';

export interface IPlan {
  name: string;
  duration: number;
  price: number;
  gymId: Types.ObjectId;
}

export interface IPlanDocument extends IPlan, Document {
  _id: Types.ObjectId;
}

export interface CreatePlanDto {
  name: string;
  duration: number;
  price: number;
}

export interface UpdatePlanDto {
  name?: string;
  duration?: number;
  price?: number;
}
