import { authRepository } from './auth.repository';
import type { RegisterDto, LoginDto } from './auth.types';
import { AppError } from '../../shared/AppError';
import { hashService } from '../../shared/hashService';
import { tokenService } from '../../shared/tokenService';

export const authService = {
  async register(data: RegisterDto) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }
    const hashedPassword = await hashService.hash(data.password);
    const user = await authRepository.create({ ...data, password: hashedPassword });

    const token = tokenService.generateToken({ userId: user._id.toString(), email: user.email });
    return { user, token };
  },

  async login(data: LoginDto) {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }
    const isValid = await hashService.compare(data.password, user.password);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }
    const token = tokenService.generateToken({ userId: user._id.toString(), email: user.email });
    return { user, token };
  },

  async getMe(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },
};
