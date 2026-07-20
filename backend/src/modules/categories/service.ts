import db from '../../db/client.js';

export function listCategories(userId: number) {
  return db.prepare(
    'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY user_id NULLS FIRST, id'
  ).all(userId).map(row => mapRow(row));
}

export function createCategory(userId: number, data: { name: string; kind: string; icon?: string | null; color?: string | null }) {
  const stmt = db.prepare(
    'INSERT INTO categories (user_id, name, kind, icon, color) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(userId, data.name, data.kind, data.icon ?? null, data.color ?? null);
  return getCategoryById(result.lastInsertRowid as number, userId);
}

export function getCategoryById(id: number, userId: number) {
  const row = db.prepare(
    'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)'
  ).get(id, userId) as any;
  if (!row) {
    throw Object.assign(new Error('Категория не найдена'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export function updateCategory(id: number, userId: number, data: any) {
  const existing = getCategoryById(id, userId);
  if (existing.userId === null) {
    throw Object.assign(new Error('Нельзя изменить системную категорию'), { status: 403, code: 'FORBIDDEN' });
  }
  const name = data.name ?? existing.name;
  const kind = data.kind ?? existing.kind;
  const icon = data.icon !== undefined ? data.icon : existing.icon;
  const color = data.color !== undefined ? data.color : existing.color;

  db.prepare(
    'UPDATE categories SET name=?, kind=?, icon=?, color=? WHERE id=? AND user_id=?'
  ).run(name, kind, icon, color, id, userId);
  return getCategoryById(id, userId);
}

export function deleteCategory(id: number, userId: number) {
  const category = getCategoryById(id, userId);
  if (category.userId === null) {
    throw Object.assign(new Error('Нельзя удалить системную категорию'), { status: 403, code: 'FORBIDDEN' });
  }
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM expenses WHERE category_id = ? AND user_id = ?').get(id, userId) as any;
  if (countRow.cnt > 0) {
    throw Object.assign(new Error('Категория используется в расходах'), { status: 409, code: 'CONFLICT' });
  }
  db.prepare('DELETE FROM categories WHERE id=? AND user_id=?').run(id, userId);
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