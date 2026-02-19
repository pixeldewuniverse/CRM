const COOKIE_NAME = 'dash_session';
const SESSION_TTL_SECONDS = 60 * 60 * 6;

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

export function getDashboardSecret() {
  return process.env.DASHBOARD_SESSION_SECRET || '';
}

export function getDashboardPassword() {
  return process.env.DASHBOARD_PASSWORD || '';
}

export function getDashSessionCookieName() {
  return COOKIE_NAME;
}

export function getDashSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

export async function createDashSession(secret: string, ttlSeconds = SESSION_TTL_SECONDS) {
  const payloadObj = {
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(payloadObj)));
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyDashSession(token: string, secret: string) {
  if (!token || !secret) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expected = await sign(payload, secret);
  if (expected !== signature) return false;

  try {
    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    const parsed = JSON.parse(decoded);
    if (!parsed?.exp || typeof parsed.exp !== 'number') return false;
    return parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
