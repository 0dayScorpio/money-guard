import Dexie, { type EntityTable } from 'dexie';

export interface ScanHistoryRecord {
  id: string;
  timestamp: Date;
  result: 'authentic' | 'suspicious' | 'fake';
  currency: string;
  denomination: string;
  confidence: number;
}

const db = new Dexie('NotaGuardDB') as Dexie & {
  scanHistory: EntityTable<ScanHistoryRecord, 'id'>;
};

db.version(1).stores({
  scanHistory: 'id, timestamp, result, currency'
});

export { db };
