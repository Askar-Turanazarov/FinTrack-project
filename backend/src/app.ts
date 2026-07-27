import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import { initDb } from './db/client.js';
import authRoutes from './modules/auth/routes.js';
import incomeSourcesRoutes from './modules/income-sources/routes.js';
import incomesRoutes from './modules/incomes/routes.js';
import categoriesRoutes from './modules/categories/routes.js';
import expensesRoutes from './modules/expenses/routes.js';
import summaryRoutes from './modules/summary/routes.js';

const app = express();

let dbReady: Promise<void> | null = null;

app.use(async (_req, _res, next) => {
  try {
    if (!dbReady) dbReady = initDb();
    await dbReady;
    next();
  } catch (err) {
    next(err);
  }
});

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: { code: 'RATE_LIMITED', message: 'Слишком много запросов, попробуйте позже' } },
});

app.use('/api/auth', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/income-sources', incomeSourcesRoutes);
app.use('/api/incomes', incomesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/summary', summaryRoutes);

app.use(errorHandler);

export default app;
