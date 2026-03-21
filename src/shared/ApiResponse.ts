import type { Response } from 'express';
import type { PaginationMeta } from '../types/common.types';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data?: T,
    message = 'Success',
    statusCode = 200,
    meta?: PaginationMeta,
  ): Response {
    const body: SuccessResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };

    return res.status(statusCode).json(body);
  }

  static error(
    res: Response,
    message = 'Something went wrong',
    statusCode = 500,
    errors?: Array<{ field: string; message: string }>,
  ): Response {
    const body: ErrorResponse = {
      success: false,
      message,
      ...(errors && { errors }),
    };

    return res.status(statusCode).json(body);
  }
}
