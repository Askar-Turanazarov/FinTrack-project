export type IncomeSourceType = 'salary' | 'freelance' | 'other';
export type CategoryKind = 'subscription' | 'utility' | 'groceries' | 'rent' | 'other';
export type Recurrence = 'monthly' | 'yearly';

export interface User {
  id: number;
  email: string;
  displayName: string | null;
  defaultCurrency: string;
  createdAt: string;
}

export interface IncomeSource {
  id: number;
  name: string;
  type: IncomeSourceType;
  isActive: boolean;
  createdAt: string;
}

export interface Income {
  id: number;
  sourceId: number | null;
  amountMinor: number;
  currency: string;
  receivedAt: string;
  note: string | null;
  isRecurring: boolean;
  recurrence: Recurrence | null;
  createdAt: string;
}

export interface Category {
  id: number;
  userId: number | null;
  name: string;
  kind: CategoryKind;
  icon: string | null;
  color: string | null;
}

export interface Expense {
  id: number;
  categoryId: number;
  amountMinor: number;
  currency: string;
  spentAt: string;
  description: string | null;
  isRecurring: boolean;
  recurrence: Recurrence | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface MonthlySummary {
  month: string;
  currency: string;
  totalIncomeMinor: number;
  totalExpenseMinor: number;
  balanceMinor: number;
}

export interface CategorySummaryItem {
  categoryId: number;
  name: string;
  kind: CategoryKind;
  totalMinor: number;
}

export interface SourceSummaryItem {
  sourceId: number | null;
  name: string | null;
  totalMinor: number;
}

export interface RecurringItem {
  type: 'expense';
  categoryId: number;
  name: string;
  amountMinor: number;
  recurrence: Recurrence;
}

export interface RecurringSummary {
  monthlyExpenseMinor: number;
  items: RecurringItem[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}