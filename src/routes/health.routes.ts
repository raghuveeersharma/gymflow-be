import { Router } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../shared/ApiResponse';

const router = Router();

router.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

  ApiResponse.success(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  }, 'Server is healthy');
});

export const healthRoutes = router;
