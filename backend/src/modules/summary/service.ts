import db from '../../db/client.js';

export function getMonthlySummary(userId: number, month: string) {
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const incomeRow = db.prepare(`
    SELECT COALESCE(SUM(amount_minor), 0) AS total
    FROM incomes
    WHERE user_id = ? AND received_at >= ? AND received_at < ?
  `).get(userId, from, to) as any;

  const expenseRow = db.prepare(`
    SELECT COALESCE(SUM(amount_minor), 0) AS total
    FROM expenses
    WHERE user_id = ? AND spent_at >= ? AND spent_at < ?
  `).get(userId, from, to) as any;

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

export function getByCategory(userId: number, month: string) {
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const rows = db.prepare(`
    SELECT e.category_id, c.name, c.kind, SUM(e.amount_minor) AS total
    FROM expenses e
    JOIN categories c ON c.id = e.category_id
    WHERE e.user_id = ? AND e.spent_at >= ? AND e.spent_at < ?
    GROUP BY e.category_id, c.name, c.kind
    ORDER BY total DESC
  `).all(userId, from, to) as any[];

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

export function getBySource(userId: number, month: string) {
  const [year, mon] = month.split('-');
  const from = `${year}-${mon}-01`;
  const to = getNextMonth(from);

  const rows = db.prepare(`
    SELECT i.source_id, s.name, SUM(i.amount_minor) AS total
    FROM incomes i
    LEFT JOIN income_sources s ON s.id = i.source_id
    WHERE i.user_id = ? AND i.received_at >= ? AND i.received_at < ?
    GROUP BY i.source_id, s.name
    ORDER BY total DESC
  `).all(userId, from, to) as any[];

  return {
    month,
    items: rows.map(row => ({
      sourceId: row.source_id,
      name: row.name,
      totalMinor: row.total,
    })),
  };
}

export function getRecurring(userId: number) {
  const rows = db.prepare(`
    SELECT category_id, amount_minor, recurrence
    FROM expenses
    WHERE user_id = ? AND is_recurring = 1
  `).all(userId) as any[];

  const items = rows.map(row => {
    const cat = db.prepare('SELECT name FROM categories WHERE id = ?').get(row.category_id) as any;
    return {
      type: 'expense' as const,
      categoryId: row.category_id,
      name: cat?.name || 'Неизвестная',
      amountMinor: row.amount_minor,
      recurrence: row.recurrence,
    };
  });

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