import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, categoryId, page = '1', limit = '20' } = req.query;
    const result = service.listExpenses(req.userId!, {
      from: from as string | undefined,
      to: to as string | undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
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
    const expense = service.createExpense(req.userId!, req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

export function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = service.getExpenseById(Number(req.params.id), req.userId!);
    res.json(expense);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = service.updateExpense(Number(req.params.id), req.userId!, req.body);
    res.json(expense);
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction) {
  try {
    service.deleteExpense(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}