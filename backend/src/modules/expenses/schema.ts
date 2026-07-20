import { z } from 'zod';

export const createExpenseSchema = z.object({
  categoryId: z.number().int().positive(),
  amountMinor: z.number().int().positive(),
  currency: z.string().length(3).default('UZS'),
  spentAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().max(500).nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurrence: z.enum(['monthly', 'yearly']).nullable().optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();
