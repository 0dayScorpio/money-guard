import { Preferences } from '@capacitor/preferences';

const DEVICE_TOKEN_KEY = 'device_token';

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

export async function consumeScan(): Promise<ScanLimitResult> {
  return {
    allowed: true,
    remaining: Infinity,
    limit: Infinity,
    used: 0,
  };
}

export async function getScanRemaining(): Promise<number> {
  return Infinity;
}
