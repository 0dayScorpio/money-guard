import { Preferences } from '@capacitor/preferences';

const DEVICE_TOKEN_KEY = 'device_token';
const DAILY_LIMIT = 5;

// External Supabase project for scan limiting (public/publishable values)
const SCAN_SUPABASE_URL = 'https://mgcslsffeonhgdmlrjoz.supabase.co';
const SCAN_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nY3Nsc2ZmZW9uaGdkbWxyam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDk0NjAsImV4cCI6MjA4NjQ4NTQ2MH0.Tg8R8AdEMmxgdcPM-zpCmLH_vh30_DK8HTrmoEhl2SI';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
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

const SCAN_STATUS_KEY = 'scan_status';

interface StoredScanStatus {
  date: string;
  remaining: number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getScanRemaining(): Promise<number> {
  const { value } = await Preferences.get({ key: SCAN_STATUS_KEY });
  if (value) {
    try {
      const stored: StoredScanStatus = JSON.parse(value);
      if (stored.date === todayKey()) return stored.remaining;
    } catch { /* ignore */ }
  }
  return DAILY_LIMIT;
}

async function saveScanStatus(remaining: number): Promise<void> {
  const status: StoredScanStatus = { date: todayKey(), remaining };
  await Preferences.set({ key: SCAN_STATUS_KEY, value: JSON.stringify(status) });
}

export async function consumeScan(): Promise<ScanLimitResult> {
  const deviceToken = await getDeviceToken();

  const response = await fetch(`${SCAN_SUPABASE_URL}/rest/v1/rpc/consume_scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SCAN_SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SCAN_SUPABASE_ANON_KEY}`,
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
  const result = Array.isArray(data) ? data[0] : data;

  const scanResult: ScanLimitResult = {
    allowed: result.allowed,
    remaining: result.remaining,
    limit: result.limit,
    used: result.used,
  };

  await saveScanStatus(scanResult.remaining);
  return scanResult;
}
