import { getClient } from '../../db/client.js';

export async function listCategories(userId: number) {
  const db = getClient();
  const rows = (await db.execute({
    sql: 'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY user_id NULLS FIRST, id',
    args: [userId],
  })).rows;
  return rows.map(row => mapRow(row));
}

export async function createCategory(userId: number, data: { name: string; kind: string; icon?: string | null; color?: string | null }) {
  const db = getClient();
  const result = await db.execute({
    sql: 'INSERT INTO categories (user_id, name, kind, icon, color) VALUES (?, ?, ?, ?, ?)',
    args: [userId, data.name, data.kind, data.icon ?? null, data.color ?? null],
  });
  return getCategoryById(Number(result.lastInsertRowid), userId);
}

export async function getCategoryById(id: number, userId: number) {
  const db = getClient();
  const row = (await db.execute({
    sql: 'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
    args: [id, userId],
  })).rows[0] as any;
  if (!row) {
    throw Object.assign(new Error('Категория не найдена'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export async function updateCategory(id: number, userId: number, data: any) {
  const existing = await getCategoryById(id, userId);
  if (existing.userId === null) {
    throw Object.assign(new Error('Нельзя изменить системную категорию'), { status: 403, code: 'FORBIDDEN' });
  }
  const name = data.name ?? existing.name;
  const kind = data.kind ?? existing.kind;
  const icon = data.icon !== undefined ? data.icon : existing.icon;
  const color = data.color !== undefined ? data.color : existing.color;
  const db = getClient();

  await db.execute({
    sql: 'UPDATE categories SET name=?, kind=?, icon=?, color=? WHERE id=? AND user_id=?',
    args: [name, kind, icon, color, id, userId],
  });
  return getCategoryById(id, userId);
}

export async function deleteCategory(id: number, userId: number) {
  const category = await getCategoryById(id, userId);
  if (category.userId === null) {
    throw Object.assign(new Error('Нельзя удалить системную категорию'), { status: 403, code: 'FORBIDDEN' });
  }
  const db = getClient();
  const countRow = (await db.execute({
    sql: 'SELECT COUNT(*) as cnt FROM expenses WHERE category_id = ? AND user_id = ?',
    args: [id, userId],
  })).rows[0] as any;
  if (countRow.cnt > 0) {
    throw Object.assign(new Error('Категория используется в расходах'), { status: 409, code: 'CONFLICT' });
  }
  await db.execute({ sql: 'DELETE FROM categories WHERE id=? AND user_id=?', args: [id, userId] });
  return category;
}

function mapRow(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    kind: row.kind,
    icon: row.icon,
    color: row.color,
  };
}
