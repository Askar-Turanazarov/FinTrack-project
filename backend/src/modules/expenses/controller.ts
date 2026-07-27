import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, categoryId, page = '1', limit = '20' } = req.query;
    const result = await service.listExpenses(req.userId!, {
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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await service.createExpense(req.userId!, req.body);
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await service.getExpenseById(Number(req.params.id), req.userId!);
    res.json(expense);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const expense = await service.updateExpense(Number(req.params.id), req.userId!, req.body);
    res.json(expense);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteExpense(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
