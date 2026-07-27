import { getClient } from '../../db/client.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser(email: string, password: string, displayName?: string) {
  const db = getClient();
  const existing = (await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] })).rows[0];
  if (existing) {
    throw Object.assign(new Error('Email уже занят'), { status: 409, code: 'CONFLICT' });
  }

  const passwordHash = await hashPassword(password);
  const result = await db.execute({
    sql: 'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
    args: [email, passwordHash, displayName || null],
  });
  const user = (await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [Number(result.lastInsertRowid)] })).rows[0] as any;

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
  const db = getClient();
  const row = (await db.execute({ sql: 'SELECT * FROM users WHERE email = ?', args: [email] })).rows[0] as any;
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

export async function getUserById(userId: number) {
  const db = getClient();
  const row = (await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [userId] })).rows[0] as any;
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
