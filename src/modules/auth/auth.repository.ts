import { User } from './auth.model';
import type { IUserDocument, RegisterDto } from './auth.types';

export const authRepository = {
  async create(data: RegisterDto & { password: string }): Promise<IUserDocument> {
    return User.create(data);
  },

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select('+password').exec();
  },

  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id).exec();
  },
};
