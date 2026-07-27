import { createClient, Client } from '@libsql/client';
import { env } from '../config/env.js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let client: Client;

export function getClient(): Client {
  if (!client) {
    client = createClient({
      url: env.TURSO_DATABASE_URL,
      authToken: env.TURSO_AUTH_TOKEN || undefined,
    });
  }
  return client;
}

export async function initDb(): Promise<void> {
  const db = getClient();
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');

  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await db.execute(stmt);
  }

  const systemCategories = [
    { name: 'Подписки', kind: 'subscription' },
    { name: 'Коммуналка', kind: 'utility' },
    { name: 'Продукты', kind: 'groceries' },
    { name: 'Аренда', kind: 'rent' },
    { name: 'Жилье и ЖКХ', kind: 'rent' },
    { name: 'Транспорт', kind: 'other' },
    { name: 'Кафе и рестораны', kind: 'other' },
    { name: 'Здоровье и уход', kind: 'other' },
    { name: 'Шопинг', kind: 'other' },
    { name: 'Развлечения и подписки', kind: 'subscription' },
    { name: 'Кредиты и финансы', kind: 'other' },
    { name: 'Семья и питомцы', kind: 'other' },
    { name: 'Подарки и донаты', kind: 'other' },
    { name: 'Путешествия', kind: 'other' },
    { name: 'Прочее', kind: 'other' },
  ];

  for (const cat of systemCategories) {
    const rows = (await db.execute({
      sql: 'SELECT id FROM categories WHERE name = ? AND user_id IS NULL',
      args: [cat.name],
    })).rows;
    if ((rows as any[]).length === 0) {
      await db.execute({
        sql: 'INSERT OR IGNORE INTO categories (user_id, name, kind) VALUES (NULL, ?, ?)',
        args: [cat.name, cat.kind],
      });
    }
  }
}
