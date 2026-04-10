import 'server-only';

export type QueryParams = Record<string, string | number | undefined>;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfig() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
}

function buildUrl(path: string, query?: QueryParams) {
  const url = new URL(`${SUPABASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function supabaseAdminRequest<T>(
  path: string,
  init: RequestInit = {},
  query?: QueryParams
): Promise<T> {
  assertConfig();

  const response = await fetch(buildUrl(path, query), {
    ...init,
    cache: 'no-store',
    headers: {
      apikey: SERVICE_ROLE_KEY || '',
      Authorization: `Bearer ${SERVICE_ROLE_KEY || ''}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Supabase request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
