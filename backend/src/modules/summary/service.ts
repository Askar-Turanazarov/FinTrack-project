import { getClient } from '../../db/client.js';

export async function getMonthlySummary(userId: number, month: string) {
  const db = getClient();
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const incomeRow = (await db.execute({
    sql: `SELECT COALESCE(SUM(amount_minor), 0) AS total
      FROM incomes WHERE user_id = ? AND received_at >= ? AND received_at < ?`,
    args: [userId, from, to],
  })).rows[0] as any;

  const expenseRow = (await db.execute({
    sql: `SELECT COALESCE(SUM(amount_minor), 0) AS total
      FROM expenses WHERE user_id = ? AND spent_at >= ? AND spent_at < ?`,
    args: [userId, from, to],
  })).rows[0] as any;

  const totalIncomeMinor = incomeRow.total;
  const totalExpenseMinor = expenseRow.total;

  return {
    month,
    currency: 'UZS',
    totalIncomeMinor,
    totalExpenseMinor,
    balanceMinor: totalIncomeMinor - totalExpenseMinor,
  };
}

export async function getByCategory(userId: number, month: string) {
  const db = getClient();
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const rows = (await db.execute({
    sql: `SELECT e.category_id, c.name, c.kind, SUM(e.amount_minor) AS total
      FROM expenses e JOIN categories c ON c.id = e.category_id
      WHERE e.user_id = ? AND e.spent_at >= ? AND e.spent_at < ?
      GROUP BY e.category_id, c.name, c.kind ORDER BY total DESC`,
    args: [userId, from, to],
  })).rows as any[];

  return {
    month,
    items: rows.map(row => ({
      categoryId: row.category_id,
      name: row.name,
      kind: row.kind,
      totalMinor: row.total,
    })),
  };
}

export async function getBySource(userId: number, month: string) {
  const db = getClient();
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const rows = (await db.execute({
    sql: `SELECT i.source_id, s.name, SUM(i.amount_minor) AS total
      FROM incomes i LEFT JOIN income_sources s ON s.id = i.source_id
      WHERE i.user_id = ? AND i.received_at >= ? AND i.received_at < ?
      GROUP BY i.source_id, s.name ORDER BY total DESC`,
    args: [userId, from, to],
  })).rows as any[];

  return {
    month,
    items: rows.map(row => ({
      sourceId: row.source_id,
      name: row.name,
      totalMinor: row.total,
    })),
  };
}

export async function getRecurring(userId: number) {
  const db = getClient();
  const rows = (await db.execute({
    sql: `SELECT category_id, amount_minor, recurrence
      FROM expenses WHERE user_id = ? AND is_recurring = 1`,
    args: [userId],
  })).rows as any[];

  const items = [];
  for (const row of rows) {
    const cat = (await db.execute({ sql: 'SELECT name FROM categories WHERE id = ?', args: [row.category_id] })).rows[0] as any;
    items.push({
      type: 'expense' as const,
      categoryId: row.category_id,
      name: cat?.name || 'Неизвестная',
      amountMinor: row.amount_minor,
      recurrence: row.recurrence,
    });
  }

  const monthlyExpenseMinor = items
    .filter(item => item.recurrence === 'monthly')
    .reduce((sum, item) => sum + item.amountMinor, 0);

  return {
    monthlyExpenseMinor,
    items,
  };
}

function getNextMonth(date: string): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}
