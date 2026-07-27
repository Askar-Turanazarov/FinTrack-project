import { getClient } from '../../db/client.js';

export async function listIncomes(userId: number, params: {
  from?: string;
  to?: string;
  sourceId?: number;
  page: number;
  limit: number;
}) {
  const db = getClient();
  const { from, to, sourceId, page, limit } = params;
  const conditions: string[] = ['i.user_id = ?'];
  const values: any[] = [userId];

  if (from) { conditions.push('i.received_at >= ?'); values.push(from); }
  if (to) { conditions.push('i.received_at < ?'); values.push(to); }
  if (sourceId) { conditions.push('i.source_id = ?'); values.push(sourceId); }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countRow = (await db.execute({ sql: `SELECT COUNT(*) as total FROM incomes i ${where}`, args: values })).rows[0] as any;
  const total = countRow.total;

  const rows = (await db.execute({
    sql: `SELECT i.* FROM incomes i ${where} ORDER BY i.received_at DESC LIMIT ? OFFSET ?`,
    args: [...values, limit, offset],
  })).rows;

  return {
    items: rows.map(row => mapRow(row)),
    page,
    limit,
    total,
  };
}

export async function createIncome(userId: number, data: any) {
  const db = getClient();
  const result = await db.execute({
    sql: `INSERT INTO incomes (user_id, source_id, amount_minor, currency, received_at, note, is_recurring, recurrence)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      userId,
      data.sourceId ?? null,
      data.amountMinor,
      data.currency,
      data.receivedAt,
      data.note ?? null,
      data.isRecurring ? 1 : 0,
      data.recurrence ?? null,
    ],
  });
  return getIncomeById(Number(result.lastInsertRowid), userId);
}

export async function getIncomeById(id: number, userId: number) {
  const db = getClient();
  const row = (await db.execute({ sql: 'SELECT * FROM incomes WHERE id = ? AND user_id = ?', args: [id, userId] })).rows[0] as any;
  if (!row) {
    throw Object.assign(new Error('Доход не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export async function updateIncome(id: number, userId: number, data: any) {
  const existing = await getIncomeById(id, userId);
  const merged = { ...existing, ...data };
  const db = getClient();

  await db.execute({
    sql: `UPDATE incomes SET source_id=?, amount_minor=?, currency=?, received_at=?, note=?, is_recurring=?, recurrence=?
      WHERE id=? AND user_id=?`,
    args: [
      merged.sourceId ?? null,
      merged.amountMinor,
      merged.currency,
      merged.receivedAt,
      merged.note ?? null,
      merged.isRecurring ? 1 : 0,
      merged.recurrence ?? null,
      id,
      userId,
    ],
  });

  return getIncomeById(id, userId);
}

export async function deleteIncome(id: number, userId: number) {
  const income = await getIncomeById(id, userId);
  const db = getClient();
  await db.execute({ sql: 'DELETE FROM incomes WHERE id = ? AND user_id = ?', args: [id, userId] });
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
