import db from '../../db/client.js';

export function listIncomes(userId: number, params: {
  from?: string;
  to?: string;
  sourceId?: number;
  page: number;
  limit: number;
}) {
  const { from, to, sourceId, page, limit } = params;
  const conditions: string[] = ['i.user_id = ?'];
  const values: any[] = [userId];

  if (from) { conditions.push('i.received_at >= ?'); values.push(from); }
  if (to) { conditions.push('i.received_at < ?'); values.push(to); }
  if (sourceId) { conditions.push('i.source_id = ?'); values.push(sourceId); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM incomes i ${where}`).get(...values) as any;
  const total = countRow.total;

  const rows = db.prepare(
    `SELECT i.* FROM incomes i ${where} ORDER BY i.received_at DESC LIMIT ? OFFSET ?`
  ).all(...values, limit, offset);

  return {
    items: rows.map(row => mapRow(row)),
    page,
    limit,
    total,
  };
}

export function createIncome(userId: number, data: any) {
  const stmt = db.prepare(`
    INSERT INTO incomes (user_id, source_id, amount_minor, currency, received_at, note, is_recurring, recurrence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    userId,
    data.sourceId ?? null,
    data.amountMinor,
    data.currency,
    data.receivedAt,
    data.note ?? null,
    data.isRecurring ? 1 : 0,
    data.recurrence ?? null,
  );
  return getIncomeById(result.lastInsertRowid as number, userId);
}

export function getIncomeById(id: number, userId: number) {
  const row = db.prepare('SELECT * FROM incomes WHERE id = ? AND user_id = ?').get(id, userId) as any;
  if (!row) {
    throw Object.assign(new Error('Доход не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export function updateIncome(id: number, userId: number, data: any) {
  const existing = getIncomeById(id, userId);
  const merged = { ...existing, ...data };

  db.prepare(`
    UPDATE incomes SET source_id=?, amount_minor=?, currency=?, received_at=?, note=?, is_recurring=?, recurrence=?
    WHERE id=? AND user_id=?
  `).run(
    merged.sourceId ?? null,
    merged.amountMinor,
    merged.currency,
    merged.receivedAt,
    merged.note ?? null,
    merged.isRecurring ? 1 : 0,
    merged.recurrence ?? null,
    id,
    userId,
  );

  return getIncomeById(id, userId);
}

export function deleteIncome(id: number, userId: number) {
  const income = getIncomeById(id, userId);
  db.prepare('DELETE FROM incomes WHERE id = ? AND user_id = ?').run(id, userId);
  return income;
}

function mapRow(row: any) {
  return {
    id: row.id,
    sourceId: row.source_id,
    amountMinor: row.amount_minor,
    currency: row.currency,
    receivedAt: row.received_at,
    note: row.note,
    isRecurring: !!row.is_recurring,
    recurrence: row.recurrence,
    createdAt: row.created_at,
  };
}