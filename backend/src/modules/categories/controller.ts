import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = service.listCategories(_req.userId!);
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction) {
  try {
    const category = service.createCategory(req.userId!, req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction) {
  try {
    const category = service.updateCategory(Number(req.params.id), req.userId!, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction) {
  try {
    service.deleteCategory(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
