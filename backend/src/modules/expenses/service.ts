import { getClient } from '../../db/client.js';

export async function listExpenses(userId: number, params: {
  from?: string;
  to?: string;
  categoryId?: number;
  page: number;
  limit: number;
}) {
  const db = getClient();
  const { from, to, categoryId, page, limit } = params;
  const conditions: string[] = ['e.user_id = ?'];
  const values: any[] = [userId];

  if (from) { conditions.push('e.spent_at >= ?'); values.push(from); }
  if (to) { conditions.push('e.spent_at < ?'); values.push(to); }
  if (categoryId) { conditions.push('e.category_id = ?'); values.push(categoryId); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countRow = (await db.execute({ sql: `SELECT COUNT(*) as total FROM expenses e ${where}`, args: values })).rows[0] as any;
  const total = countRow.total;

  const rows = (await db.execute({
    sql: `SELECT e.* FROM expenses e ${where} ORDER BY e.spent_at DESC LIMIT ? OFFSET ?`,
    args: [...values, limit, offset],
  })).rows;

  return {
    items: rows.map(row => mapRow(row)),
    page,
    limit,
    total,
  };
}

export async function createExpense(userId: number, data: any) {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO expenses (user_id, category_id, amount_minor, currency, spent_at, description, is_recurring, recurrence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      userId,
      data.categoryId,
      data.amountMinor,
      data.currency,
      data.spentAt,
      data.description ?? null,
      data.isRecurring ? 1 : 0,
      data.recurrence ?? null,
    ],
  });
  return getExpenseById(Number(result.lastInsertRowid), userId);
}

export async function getExpenseById(id: number, userId: number) {
  const db = getClient();
  const row = (await db.execute({ sql: 'SELECT * FROM expenses WHERE id = ? AND user_id = ?', args: [id, userId] })).rows[0] as any;
  if (!row) {
    throw Object.assign(new Error('Расход не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export async function updateExpense(id: number, userId: number, data: any) {
  const existing = await getExpenseById(id, userId);
  const merged = { ...existing, ...data };
  const db = getClient();

  await db.execute({
    sql: `UPDATE expenses SET category_id=?, amount_minor=?, currency=?, spent_at=?, description=?, is_recurring=?, recurrence=?
      WHERE id=? AND user_id=?`,
    args: [
      merged.categoryId,
      merged.amountMinor,
      merged.currency,
      merged.spentAt,
      merged.description ?? null,
      merged.isRecurring ? 1 : 0,
      merged.recurrence ?? null,
      id,
      userId,
    ],
  });

  return getExpenseById(id, userId);
}

export async function deleteExpense(id: number, userId: number) {
  const expense = await getExpenseById(id, userId);
  const db = getClient();
  await db.execute({ sql: 'DELETE FROM expenses WHERE id = ? AND user_id = ?', args: [id, userId] });
  return expense;
}

function mapRow(row: any) {
  return {
    id: row.id,
    categoryId: row.category_id,
    amountMinor: row.amount_minor,
    currency: row.currency,
    spentAt: row.spent_at,
    description: row.description,
    isRecurring: !!row.is_recurring,
    recurrence: row.recurrence,
    createdAt: row.created_at,
  };
}
