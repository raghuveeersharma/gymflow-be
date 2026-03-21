import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '../shared/AppError';

type ValidationSource = 'body' | 'query' | 'params';

const assignInPlace = (target: Record<string, unknown>, parsed: Record<string, unknown>): void => {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.assign(target, parsed);
};

export const validate = (schema: ZodSchema, source: ValidationSource = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);

      if (source === 'query' && req.query && typeof req.query === 'object') {
        assignInPlace(req.query as Record<string, unknown>, parsed as Record<string, unknown>);
      } else {
        req[source] = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const appError = new AppError('Validation failed', 400);
        (appError as AppError & { errors: Array<{ field: string; message: string }> }).errors =
          formattedErrors;
        throw appError;
      }

      throw error;
    }
  };
};
