import db from '../../db/client.js';

export function listExpenses(userId: number, params: {
  from?: string;
  to?: string;
  categoryId?: number;
  page: number;
  limit: number;
}) {
  const { from, to, categoryId, page, limit } = params;
  const conditions: string[] = ['e.user_id = ?'];
  const values: any[] = [userId];

  if (from) { conditions.push('e.spent_at >= ?'); values.push(from); }
  if (to) { conditions.push('e.spent_at < ?'); values.push(to); }
  if (categoryId) { conditions.push('e.category_id = ?'); values.push(categoryId); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM expenses e ${where}`).get(...values) as any;
  const total = countRow.total;

  const rows = db.prepare(
    `SELECT e.* FROM expenses e ${where} ORDER BY e.spent_at DESC LIMIT ? OFFSET ?`
  ).all(...values, limit, offset);

  return {
    items: rows.map(row => mapRow(row)),
    page,
    limit,
    total,
  };
}

export function createExpense(userId: number, data: any) {
  const stmt = db.prepare(`
    INSERT INTO expenses (user_id, category_id, amount_minor, currency, spent_at, description, is_recurring, recurrence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    userId,
    data.categoryId,
    data.amountMinor,
    data.currency,
    data.spentAt,
    data.description ?? null,
    data.isRecurring ? 1 : 0,
    data.recurrence ?? null,
  );
  return getExpenseById(result.lastInsertRowid as number, userId);
}

export function getExpenseById(id: number, userId: number) {
  const row = db.prepare('SELECT * FROM expenses WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!row) {
    throw Object.assign(new Error('Расход не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export function updateExpense(id: number, userId: number, data: any) {
  const existing = getExpenseById(id, userId);
  const merged = { ...existing, ...data };

  db.prepare(`
    UPDATE expenses SET category_id=?, amount_minor=?, currency=?, spent_at=?, description=?, is_recurring=?, recurrence=?
    WHERE id=? AND user_id=?
  `).run(
    merged.categoryId,
    merged.amountMinor,
    merged.currency,
    merged.spentAt,
    merged.description ?? null,
    merged.isRecurring ? 1 : 0,
    merged.recurrence ?? null,
    id,
    userId,
  );

  return getExpenseById(id, userId);
}

export function deleteExpense(id: number, userId: number) {
  const expense = getExpenseById(id, userId);
  db.prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?').run(id, userId);
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