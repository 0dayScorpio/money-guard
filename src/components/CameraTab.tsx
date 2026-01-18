import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, AlertCircle, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScanResult, ScanHistory } from '@/types';

interface CameraTabProps {
  onScanComplete: (scan: ScanHistory) => void;
}

export const CameraTab = ({ onScanComplete }: CameraTabProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>(null);
  const [confidence, setConfidence] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const simulateScan = useCallback(() => {
    setIsScanning(true);
    setScanResult(null);
    setShowResult(false);
    
    // Simulate scanning delay
    setTimeout(() => {
      const random = Math.random();
      let result: ScanResult;
      let conf: number;
      
      if (random > 0.3) {
        result = 'authentic';
        conf = 85 + Math.random() * 14;
      } else if (random > 0.1) {
        result = 'suspicious';
        conf = 50 + Math.random() * 30;
      } else {
        result = 'fake';
        conf = 70 + Math.random() * 25;
      }
      
      setScanResult(result);
      setConfidence(conf);
      setIsScanning(false);
      setShowResult(true);
      
      // Save to history
      const scan: ScanHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result,
        currency: 'EUR',
        denomination: '20',
        confidence: conf,
      };
      onScanComplete(scan);
    }, 2500);
  }, [onScanComplete]);

  const getResultConfig = (result: ScanResult) => {
    switch (result) {
      case 'authentic':
        return {
          icon: CheckCircle2,
          title: 'Вероятно истинска',
          description: 'Банкнотата показва очаквани защитни характеристики.',
          bgClass: 'bg-success/10 dark:bg-success/20',
          textClass: 'text-success',
          glowClass: 'shadow-glow-success',
          gradientClass: 'gradient-success',
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Съмнителна',
          description: 'Открити са някои несъответствия. Проверете отново ръчно.',
          bgClass: 'bg-warning/10 dark:bg-warning/20',
          textClass: 'text-warning',
          glowClass: 'shadow-glow-warning',
          gradientClass: 'gradient-warning',
        };
      case 'fake':
        return {
          icon: XCircle,
          title: 'Възможно фалшива',
          description: 'Открити са сериозни несъответствия с оригинала.',
          bgClass: 'bg-destructive/10 dark:bg-destructive/20',
          textClass: 'text-destructive',
          glowClass: 'shadow-glow-danger',
          gradientClass: 'gradient-danger',
        };
      default:
        return null;
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setShowResult(false);
    setConfidence(0);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Camera viewport */}
      <div className="relative flex-1 bg-black/90 dark:bg-black overflow-hidden">
        {/* Simulated camera view */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-[16/10] mx-4">
            {/* Camera frame */}
            <motion.div
              animate={isScanning ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
              transition={{ duration: 1.5, repeat: isScanning ? Infinity : 0 }}
              className="absolute inset-0 border-2 border-white/50 rounded-2xl"
            >
              {/* Corner accents */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
            </motion.div>

            {/* Scanning line */}
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  initial={{ top: 0, opacity: 0 }}
                  animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-2 right-2 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/50"
                />
              )}
            </AnimatePresence>

            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <Camera className="w-16 h-16 mb-4" />
              <p className="text-sm text-center px-4">
                {isScanning ? 'Анализиране...' : 'Поставете банкнотата в рамката'}
              </p>
            </div>
          </div>
        </div>

        {/* Scan button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={simulateScan}
              disabled={isScanning}
              size="lg"
              className="h-20 w-20 rounded-full gradient-primary shadow-xl disabled:opacity-50"
            >
              {isScanning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Scan className="w-8 h-8 text-white" />
                </motion.div>
              ) : (
                <Zap className="w-8 h-8 text-white" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Results panel */}
      <AnimatePresence>
        {showResult && scanResult && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-card border-t border-border"
          >
            {(() => {
              const config = getResultConfig(scanResult);
              if (!config) return null;
              const Icon = config.icon;
              
              return (
                <div className="p-6 space-y-4">
                  {/* Result header */}
                  <div className={`flex items-center gap-4 p-4 rounded-2xl ${config.bgClass}`}>
                    <div className={`p-3 rounded-xl ${config.gradientClass}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl ${config.textClass}`}>
                        {config.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Увереност: {confidence.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground">
                    {config.description}
                  </p>

                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
                    <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Резултатът е ориентировъчен и не представлява официална експертиза. 
                      При съмнения се обърнете към банка или експерт.
                    </p>
                  </div>

                  {/* Actions */}
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Сканирай отново
                  </Button>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
