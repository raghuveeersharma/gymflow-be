import type { Document, Types } from 'mongoose';

export interface IMember {
  name: string;
  phone: string;
  joinDate: Date;
  expiryDate: Date;
  planId: Types.ObjectId;
  gymId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMemberDocument extends IMember, Document {
  _id: Types.ObjectId;
}

export interface CreateMemberDto {
  name: string;
  phone: string;
  planId: string;
  joinDate?: string;
}

export interface UpdateMemberDto {
  name?: string;
  phone?: string;
  planId?: string;
  joinDate?: string;
}
