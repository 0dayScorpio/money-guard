export type ScanResult = 'authentic' | 'suspicious' | 'fake' | null;

export interface ScanHistory {
  id: string;
  timestamp: Date;
  result: ScanResult;
  currency: string;
  denomination: string;
  confidence: number;
}

export interface SecurityFeature {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  howToCheck: string;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  denominations: {
    value: number;
    color: string;
    features: SecurityFeature[];
  }[];
}
