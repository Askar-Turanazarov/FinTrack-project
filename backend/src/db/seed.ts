import db from './client.js';

const systemCategories = [
  { name: 'Подписки', kind: 'subscription' },
  { name: 'Коммуналка', kind: 'utility' },
  { name: 'Продукты', kind: 'groceries' },
  { name: 'Аренда', kind: 'rent' },
  { name: 'Прочее', kind: 'other' },
] as const;

const insert = db.prepare(
  'INSERT OR IGNORE INTO categories (user_id, name, kind) VALUES (NULL, ?, ?)'
);

for (const cat of systemCategories) {
  insert.run(cat.name, cat.kind);
}

console.log('System categories seeded.');
process.exit(0);