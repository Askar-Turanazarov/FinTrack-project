import { api } from './client';
import type {
  User,
  IncomeSource,
  Income,
  Category,
  Expense,
  PaginatedResponse,
  MonthlySummary,
  CategorySummaryItem,
  SourceSummaryItem,
  RecurringSummary,
} from '../types';

// Auth
export const register = (body: { email: string; password: string; displayName?: string }) =>
  api.post<{ user: User; token: string }>('/auth/register', body);

export const login = (body: { email: string; password: string }) =>
  api.post<{ user: User; token: string }>('/auth/login', body);

export const getMe = () =>
  api.get<{ user: User }>('/auth/me');

// Income sources
export const getIncomeSources = () =>
  api.get<IncomeSource[]>('/income-sources');

export const createIncomeSource = (body: { name: string; type: string }) =>
  api.post<IncomeSource>('/income-sources', body);

export const updateIncomeSource = (id: number, body: Partial<IncomeSource>) =>
  api.patch<IncomeSource>(`/income-sources/${id}`, body);

export const deleteIncomeSource = (id: number) =>
  api.delete<void>(`/income-sources/${id}`);

// Incomes
export const getIncomes = (params: {
  from?: string;
  to?: string;
  sourceId?: number;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.sourceId) searchParams.set('sourceId', String(params.sourceId));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();
  return api.get<PaginatedResponse<Income>>(`/incomes${query ? `?${query}` : ''}`);
};

export const createIncome = (body: Omit<Income, 'id' | 'createdAt'>) =>
  api.post<Income>('/incomes', body);

export const getIncome = (id: number) =>
  api.get<Income>(`/incomes/${id}`);

export const updateIncome = (id: number, body: Partial<Income>) =>
  api.patch<Income>(`/incomes/${id}`, body);

export const deleteIncome = (id: number) =>
  api.delete<void>(`/incomes/${id}`);

// Categories
export const getCategories = () =>
  api.get<Category[]>('/categories');

export const createCategory = (body: { name: string; kind?: string; color?: string }) =>
  api.post<Category>('/categories', body);

export const updateCategory = (id: number, body: Partial<Category>) =>
  api.patch<Category>(`/categories/${id}`, body);

export const deleteCategory = (id: number) =>
  api.delete<void>(`/categories/${id}`);

// Expenses
export const getExpenses = (params: {
  from?: string;
  to?: string;
  categoryId?: number;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();
  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.categoryId) searchParams.set('categoryId', String(params.categoryId));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  const query = searchParams.toString();
  return api.get<PaginatedResponse<Expense>>(`/expenses${query ? `?${query}` : ''}`);
};

export const createExpense = (body: Omit<Expense, 'id' | 'createdAt'>) =>
  api.post<Expense>('/expenses', body);

export const getExpense = (id: number) =>
  api.get<Expense>(`/expenses/${id}`);

export const updateExpense = (id: number, body: Partial<Expense>) =>
  api.patch<Expense>(`/expenses/${id}`, body);

export const deleteExpense = (id: number) =>
  api.delete<void>(`/expenses/${id}`);

// Summary
export const getMonthlySummary = (month: string) =>
  api.get<MonthlySummary>(`/summary?month=${month}`);

export const getSummaryByCategory = (month: string) =>
  api.get<{ month: string; items: CategorySummaryItem[] }>(`/summary/by-category?month=${month}`);

export const getSummaryBySource = (month: string) =>
  api.get<{ month: string; items: SourceSummaryItem[] }>(`/summary/by-source?month=${month}`);

export const getRecurring = () =>
  api.get<RecurringSummary>('/summary/recurring');