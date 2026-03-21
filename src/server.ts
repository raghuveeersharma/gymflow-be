import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './config/logger';
import mongoose from 'mongoose';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────
  const gracefulShutdown = (signal: string): void => {
    logger.info(`\n${signal} received. Starting graceful shutdown...`);

    server.close(() => {
      logger.info('✅ HTTP server closed');

      mongoose.connection.close(false).then(() => {
        logger.info('✅ MongoDB connection closed');
        process.exit(0);
      }).catch((err) => {
        logger.error(`❌ Error closing MongoDB connection: ${(err as Error).message}`);
        process.exit(1);
      });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: Error) => {
    logger.error(`Unhandled Rejection: ${reason.message || reason}`);
    gracefulShutdown('UNHANDLED_REJECTION');
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
  });
};

startServer().catch((error) => {
  logger.error(`❌ Failed to start server: ${(error as Error).message}`);
  process.exit(1);
});
