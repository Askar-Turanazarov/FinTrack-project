import { getClient } from '../../db/client.js';

export async function listSources(userId: number) {
  const db = getClient();
  const rows = (await db.execute({
    sql: 'SELECT * FROM income_sources WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  })).rows;
  return rows.map(row => mapRow(row));
}

export async function createSource(userId: number, name: string, type: string) {
  const db = getClient();
  const result = await db.execute({
    sql: 'INSERT INTO income_sources (user_id, name, type) VALUES (?, ?, ?)',
    args: [userId, name, type],
  });
  return getSourceById(Number(result.lastInsertRowid), userId);
}

export async function getSourceById(id: number, userId: number) {
  const db = getClient();
  const row = (await db.execute({
    sql: 'SELECT * FROM income_sources WHERE id = ? AND user_id = ?',
    args: [id, userId],
  })).rows[0] as any;
  if (!row) {
    throw Object.assign(new Error('Источник не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return mapRow(row);
}

export async function updateSource(id: number, userId: number, data: { name?: string; type?: string; isActive?: boolean }) {
  const source = await getSourceById(id, userId);
  const name = data.name ?? source.name;
  const type = data.type ?? source.type;
  const isActive = data.isActive !== undefined ? (data.isActive ? 1 : 0) : source.isActive;
  const db = getClient();

  await db.execute({
    sql: 'UPDATE income_sources SET name = ?, type = ?, is_active = ? WHERE id = ? AND user_id = ?',
    args: [name, type, isActive, id, userId],
  });

  return getSourceById(id, userId);
}

export async function deleteSource(id: number, userId: number) {
  const source = await getSourceById(id, userId);
  const db = getClient();
  await db.execute({ sql: 'DELETE FROM income_sources WHERE id = ? AND user_id = ?', args: [id, userId] });
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
