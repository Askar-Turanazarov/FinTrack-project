import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await service.listCategories(_req.userId!);
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await service.createCategory(req.userId!, req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await service.updateCategory(Number(req.params.id), req.userId!, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteCategory(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
