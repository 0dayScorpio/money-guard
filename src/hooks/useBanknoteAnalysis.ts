import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DetectedFeature {
  name: string;
  detected: boolean;
  description: string;
}

export interface AnalysisResult {
  result: 'authentic' | 'suspicious' | 'fake';
  confidence: number;
  currency: string;
  denomination: number | null;
  detectedFeatures: DetectedFeature[];
  analysis: string;
  recommendations: string[];
}

interface UseBanknoteAnalysisResult {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeImage: (imageBase64: string, currency?: string) => Promise<AnalysisResult | null>;
  clearAnalysis: () => void;
}

export const useBanknoteAnalysis = (): UseBanknoteAnalysisResult => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (imageBase64: string, currency?: string): Promise<AnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-banknote', {
        body: { imageBase64, currency }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Грешка при анализа');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result: AnalysisResult = {
        result: data.result || 'suspicious',
        confidence: data.confidence || 50,
        currency: data.currency || 'UNKNOWN',
        denomination: data.denomination || null,
        detectedFeatures: data.detectedFeatures || [],
        analysis: data.analysis || 'Няма налична информация за анализа.',
        recommendations: data.recommendations || []
      };

      setAnalysisResult(result);
      return result;
    } catch (err) {
      console.error('Analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Грешка при анализа на банкнотата';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    analysisResult,
    isAnalyzing,
    error,
    analyzeImage,
    clearAnalysis,
  };
};
