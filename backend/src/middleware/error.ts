import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = env.NODE_ENV === 'production' && status === 500
    ? 'Внутренняя ошибка сервера'
    : err.message || 'Внутренняя ошибка сервера';

  res.status(status).json({
    error: { code, message },
  });
}