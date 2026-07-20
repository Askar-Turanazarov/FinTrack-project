import { Request, Response, NextFunction } from 'express';
import * as authService from './service.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, displayName } = req.body;
    const result = await authService.registerUser(email, password, displayName);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = authService.getUserById(req.userId!);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}