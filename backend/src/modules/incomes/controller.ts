import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, sourceId, page = '1', limit = '20' } = req.query;
    const result = service.listIncomes(req.userId!, {
      from: from as string | undefined,
      to: to as string | undefined,
      sourceId: sourceId ? Number(sourceId) : undefined,
      page: Math.max(1, parseInt(page as string, 10) || 1),
      limit: Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20)),
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction) {
  try {
    const income = service.createIncome(req.userId!, req.body);
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const income = service.getIncomeById(Number(req.params.id), req.userId!);
    res.json(income);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction) {
  try {
    const income = service.updateIncome(Number(req.params.id), req.userId!, req.body);
    res.json(income);
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction) {
  try {
    service.deleteIncome(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}