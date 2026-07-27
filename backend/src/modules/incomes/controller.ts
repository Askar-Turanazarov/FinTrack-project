import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, sourceId, page = '1', limit = '20' } = req.query;
    const result = await service.listIncomes(req.userId!, {
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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const income = await service.createIncome(req.userId!, req.body);
    res.status(201).json(income);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const income = await service.getIncomeById(Number(req.params.id), req.userId!);
    res.json(income);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const income = await service.updateIncome(Number(req.params.id), req.userId!, req.body);
    res.json(income);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteIncome(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
