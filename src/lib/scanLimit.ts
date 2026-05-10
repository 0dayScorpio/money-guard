import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';

const DEVICE_TOKEN_KEY = 'device_token';
const DAILY_LIMIT = 1000000;


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

  const { data, error } = await supabase.rpc('consume_scan' as any, {
    p_device_id: deviceToken,
    p_daily_limit: DAILY_LIMIT,
  });

  if (error) {
    throw new Error(`RPC error: ${error.message}`);
  }

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
