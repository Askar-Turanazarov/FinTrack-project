import { z } from 'zod';

export const createIncomeSchema = z.object({
  sourceId: z.number().int().positive().nullable().optional(),
  amountMinor: z.number().int().positive(),
  currency: z.string().length(3).default('UZS'),
  receivedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().max(500).nullable().optional(),
  isRecurring: z.boolean().default(false),
  recurrence: z.enum(['monthly', 'yearly']).nullable().optional(),
});

export const updateIncomeSchema = createIncomeSchema.partial();