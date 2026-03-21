import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export const connectDatabase = async (): Promise<void> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      logger.info('📦 MongoDB connected successfully');
      return;
    } catch (error) {
      retries++;
      const delay = BASE_DELAY_MS * Math.pow(2, retries);
      logger.error(
        `❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed. Retrying in ${delay}ms...`,
      );

      if (retries >= MAX_RETRIES) {
        logger.error('❌ MongoDB connection failed after maximum retries. Exiting...');
        process.exit(1);
      }

      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error(`❌ MongoDB error: ${err.message}`);
});
