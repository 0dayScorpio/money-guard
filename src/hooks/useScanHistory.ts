import { useState, useEffect, useCallback } from 'react';
import { db, ScanHistoryRecord } from '@/lib/db';
import { ScanHistory } from '@/types';

const MAX_HISTORY_ITEMS = 50;

export const useScanHistory = () => {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from IndexedDB on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const records = await db.scanHistory
          .orderBy('timestamp')
          .reverse()
          .limit(MAX_HISTORY_ITEMS)
          .toArray();
        
        // Convert records to ScanHistory format
        const historyItems: ScanHistory[] = records.map(record => ({
          id: record.id,
          timestamp: record.timestamp,
          result: record.result,
          currency: record.currency,
          denomination: record.denomination,
          confidence: record.confidence
        }));
        
        setHistory(historyItems);
      } catch (error) {
        console.error('Failed to load scan history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const addScan = useCallback(async (scan: ScanHistory) => {
    try {
      // Add to IndexedDB
      await db.scanHistory.add({
        id: scan.id,
        timestamp: scan.timestamp,
        result: scan.result as 'authentic' | 'suspicious' | 'fake',
        currency: scan.currency,
        denomination: scan.denomination,
        confidence: scan.confidence
      });

      // Update state (prepend new scan, limit to MAX_HISTORY_ITEMS)
      setHistory(prev => [scan, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);

      // Cleanup old records if needed
      const count = await db.scanHistory.count();
      if (count > MAX_HISTORY_ITEMS) {
        const oldestRecords = await db.scanHistory
          .orderBy('timestamp')
          .limit(count - MAX_HISTORY_ITEMS)
          .primaryKeys();
        await db.scanHistory.bulkDelete(oldestRecords);
      }
    } catch (error) {
      console.error('Failed to save scan:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await db.scanHistory.clear();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  return {
    history,
    isLoading,
    addScan,
    clearHistory
  };
};
