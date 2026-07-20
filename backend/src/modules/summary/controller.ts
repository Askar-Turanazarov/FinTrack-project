import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export function monthlySummary(req: Request, res: Response, next: NextFunction) {
  try {
    const month = req.query.month as string;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw Object.assign(new Error('Параметр month обязателен (YYYY-MM)'), { status: 400, code: 'BAD_REQUEST' });
    }
    const result = service.getMonthlySummary(req.userId!, month);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function byCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const month = req.query.month as string;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw Object.assign(new Error('Параметр month обязателен (YYYY-MM)'), { status: 400, code: 'BAD_REQUEST' });
    }
    const result = service.getByCategory(req.userId!, month);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function bySource(req: Request, res: Response, next: NextFunction) {
  try {
    const month = req.query.month as string;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      throw Object.assign(new Error('Параметр month обязателен (YYYY-MM)'), { status: 400, code: 'BAD_REQUEST' });
    }
    const result = service.getBySource(req.userId!, month);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function recurring(req: Request, res: Response, next: NextFunction) {
  try {
    const result = service.getRecurring(req.userId!);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
