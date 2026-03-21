import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const hashService = {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, SALT_ROUNDS);
  },

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  },
};
