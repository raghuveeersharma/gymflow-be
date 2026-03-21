import type { Document, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  gymName: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  gymName: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
