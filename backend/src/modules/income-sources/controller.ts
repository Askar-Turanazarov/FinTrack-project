import { Request, Response, NextFunction } from 'express';
import * as service from './service.js';

export function list(req: Request, res: Response, next: NextFunction) {
  try {
    const sources = service.listSources(req.userId!);
    res.json(sources);
  } catch (err) {
    next(err);
  }
}

export function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, type } = req.body;
    const source = service.createSource(req.userId!, name, type);
    res.status(201).json(source);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction) {
  try {
    const source = service.updateSource(Number(req.params.id), req.userId!, req.body);
    res.json(source);
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction) {
  try {
    service.deleteSource(Number(req.params.id), req.userId!);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}