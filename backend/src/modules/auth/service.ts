import db from '../../db/client.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser(email: string, password: string, displayName?: string) {
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw Object.assign(new Error('Email уже занят'), { status: 409, code: 'CONFLICT' });
  }

  const passwordHash = await hashPassword(password);
  const stmt = db.prepare(
    'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)'
  );
  const result = stmt.run(email, passwordHash, displayName || null);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any;

  const token = signToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      defaultCurrency: user.default_currency,
      createdAt: user.created_at,
    },
    token,
  };
}

export async function loginUser(email: string, password: string) {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  if (!row) {
    throw Object.assign(new Error('Неверный email или пароль'), { status: 401, code: 'UNAUTHORIZED' });
  }

  const valid = await comparePassword(password, row.password_hash);
  if (!valid) {
    throw Object.assign(new Error('Неверный email или пароль'), { status: 401, code: 'UNAUTHORIZED' });
  }

  const token = signToken(row.id);

  return {
    user: {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      defaultCurrency: row.default_currency,
      createdAt: row.created_at,
    },
    token,
  };
}

export function getUserById(userId: number) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!row) {
    throw Object.assign(new Error('Пользователь не найден'), { status: 404, code: 'NOT_FOUND' });
  }
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    defaultCurrency: row.default_currency,
    createdAt: row.created_at,
  };
}