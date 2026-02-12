import { Preferences } from '@capacitor/preferences';

const DEVICE_TOKEN_KEY = 'device_token';
const DAILY_LIMIT = 5;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getDeviceToken(): Promise<string> {
  const { value } = await Preferences.get({ key: DEVICE_TOKEN_KEY });
  if (value) return value;

  const token = generateUUID();
  await Preferences.set({ key: DEVICE_TOKEN_KEY, value: token });
  return token;
}

export interface ScanLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  used: number;
}

export async function consumeScan(): Promise<ScanLimitResult> {
  const deviceToken = await getDeviceToken();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/consume_scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      p_device_id: deviceToken,
      p_daily_limit: DAILY_LIMIT,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC error: ${response.status}`);
  }

  const data = await response.json();
  // Supabase RPC returns an array with one object
  const result = Array.isArray(data) ? data[0] : data;

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    limit: result.limit,
    used: result.used,
  };
}
