import { Context, Next } from 'hono';
import { JWTPayload } from '@/shared/types';

export function verifyJWT(token: string): JWTPayload | null {
  try {
    // Simple JWT verification - in production use proper JWT library
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}

export function signJWT(payload: JWTPayload): string {
  // Simple JWT signing - in production use proper JWT library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadStr = btoa(JSON.stringify(payload));
  return `${header}.${payloadStr}.signature`;
}

export async function ensureAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  const payload = verifyJWT(token);
  
  if (!payload) {
    return c.json({ success: false, error: 'Invalid token' }, 401);
  }

  c.set('user', payload);
  await next();
}

export function ensureRole(role: 'ngo' | 'admin' | 'buyer') {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as JWTPayload;
    if (!user || user.role !== role) {
      return c.json({ success: false, error: 'Forbidden' }, 403);
    }
    await next();
  };
}

export const ensureNGO = ensureRole('ngo');
export const ensureAdmin = ensureRole('admin');
export const ensureBuyer = ensureRole('buyer');
