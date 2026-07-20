import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.js';
import authRoutes from './modules/auth/routes.js';
import incomeSourcesRoutes from './modules/income-sources/routes.js';
import incomesRoutes from './modules/incomes/routes.js';
import categoriesRoutes from './modules/categories/routes.js';
import expensesRoutes from './modules/expenses/routes.js';
import summaryRoutes from './modules/summary/routes.js';

const app = express();

// Глобальные middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// Rate limiting на auth-эндпоинты
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 10,
  message: { error: { code: 'RATE_LIMITED', message: 'Слишком много запросов, попробуйте позже' } },
});

app.use('/api/auth', authLimiter);

// Подключение маршрутов
app.use('/api/auth', authRoutes);
app.use('/api/income-sources', incomeSourcesRoutes);
app.use('/api/incomes', incomesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/summary', summaryRoutes);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} (${env.NODE_ENV})`);
});