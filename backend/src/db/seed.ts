import { getClient, initDb } from './client.js';

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
] as const;

async function seed() {
  await initDb();
  const db = getClient();

  for (const cat of systemCategories) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO categories (user_id, name, kind) VALUES (NULL, ?, ?)',
      args: [cat.name, cat.kind],
    });
  }

  console.log('System categories seeded.');
  process.exit(0);
}

seed();
