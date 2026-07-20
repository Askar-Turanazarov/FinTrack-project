import db from '../../db/client.js';

export function listSources(userId: number) {
  return db.prepare(
    'SELECT * FROM income_sources WHERE user_id = ? ORDER BY created_at DESC'
  ).all(userId).map(row => mapRow(row));
}

export function createSource(userId: number, name: string, type: string) {
  const stmt = db.prepare(
    'INSERT INTO income_sources (user_id, name, type) VALUES (?, ?, ?)'
  );
  const result = stmt.run(userId, name, type);
  return getSourceById(result.lastInsertRowid as number, userId);
}

export function getSourceById(id: number, userId: number) {
  const row = db.prepare(
    'SELECT * FROM income_sources WHERE id = ? AND user_id = ?'
  ).get(id, userId) as any;
  if (!row) {
    throw Object.assign(new Error('Источник не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export function updateSource(id: number, userId: number, data: { name?: string; type?: string; isActive?: boolean }) {
  const source = getSourceById(id, userId);
  const name = data.name ?? source.name;
  const type = data.type ?? source.type;
  const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : source.isActive;

  db.prepare(
    'UPDATE income_sources SET name = ?, type = ?, is_active = ? WHERE id = ? AND user_id = ?'
  ).run(name, type, isActive, id, userId);

  return getSourceById(id, userId);
}

export function deleteSource(id: number, userId: number) {
  const source = getSourceById(id, userId);
  db.prepare('DELETE FROM income_sources WHERE id = ? AND user_id = ?').run(id, userId);
  return source;
}

function mapRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    isActive: !!row.is_active,
    createdAt: row.created_at,
  };
}