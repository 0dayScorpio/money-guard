import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, AlertCircle, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Image as ImageIcon, Sparkles, Shield, CheckCircle, XOctagon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScanHistory } from '@/types';
import { useCamera } from '@/hooks/useCamera';
import { useBanknoteAnalysis, AnalysisResult, DetectedFeature } from '@/hooks/useBanknoteAnalysis';

interface CameraTabProps {
  onScanComplete: (scan: ScanHistory) => void;
}

export const CameraTab = ({
  onScanComplete
}: CameraTabProps) => {
  const {
    imageBase64,
    isCapturing,
    error: cameraError,
    takePhoto,
    selectFromGallery,
    clearPhoto
  } = useCamera();
  const {
    analysisResult,
    isAnalyzing,
    error: analysisError,
    analyzeImage,
    clearAnalysis
  } = useBanknoteAnalysis();
  const [showDetails, setShowDetails] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64) return;
    const result = await analyzeImage(imageBase64);
    if (result) {
      const scan: ScanHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result: result.result,
        currency: result.currency,
        denomination: result.denomination?.toString() || 'Неизвестен',
        confidence: result.confidence
      };
      onScanComplete(scan);
    }
  }, [imageBase64, analyzeImage, onScanComplete]);

  const resetScan = useCallback(() => {
    clearPhoto();
    clearAnalysis();
    setShowDetails(false);
  }, [clearPhoto, clearAnalysis]);

  const getResultConfig = (result: AnalysisResult['result']) => {
    switch (result) {
      case 'authentic':
        return {
          icon: CheckCircle2,
          title: 'Вероятно истинска',
          description: 'Банкнотата показва очаквани защитни характеристики.',
          bgClass: 'bg-success/10 dark:bg-success/20',
          textClass: 'text-success',
          borderClass: 'border-success/30',
          gradientClass: 'gradient-success'
        };
      case 'suspicious':
        return {
          icon: AlertTriangle,
          title: 'Съмнителна',
          description: 'Открити са някои несъответствия. Проверете отново ръчно.',
          bgClass: 'bg-warning/10 dark:bg-warning/20',
          textClass: 'text-warning',
          borderClass: 'border-warning/30',
          gradientClass: 'gradient-warning'
        };
      case 'fake':
        return {
          icon: XCircle,
          title: 'Възможно фалшива',
          description: 'Открити са сериозни несъответствия с оригинала.',
          bgClass: 'bg-destructive/10 dark:bg-destructive/20',
          textClass: 'text-destructive',
          borderClass: 'border-destructive/30',
          gradientClass: 'gradient-danger'
        };
    }
  };

  const error = cameraError || analysisError;

  // SVG gradient for camera icon
  const CameraGradientIcon = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cameraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(217, 91%, 55%)" />
          <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
        </linearGradient>
      </defs>
      <path d="M14.5 4h-5L7.5 6.5H4c-.83 0-1.5.67-1.5 1.5v10c0 .83.67 1.5 1.5 1.5h16c.83 0 1.5-.67 1.5-1.5V8c0-.83-.67-1.5-1.5-1.5h-3.5L14.5 4z" stroke="url(#cameraGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="13" r="4" stroke="url(#cameraGradient)" strokeWidth="2" fill="none"/>
    </svg>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Camera viewport */}
      <div className="relative flex-1 bg-black/90 dark:bg-black overflow-hidden">
        {imageBase64 ? (
          // Show captured image
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img src={imageBase64} alt="Заснета банкнота" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
            
            {/* Analysis overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 mx-auto mb-4">
                    <Sparkles className="w-full h-full text-primary" />
                  </motion.div>
                  <p className="text-white text-lg font-medium">AI Анализ...</p>
                  <p className="text-white/60 text-sm mt-1">Проверка на защитни елементи</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Camera placeholder
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[16/10] mx-4">
              {/* Camera frame */}
              <motion.div 
                animate={isCapturing ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }} 
                transition={{ duration: 1.5, repeat: isCapturing ? Infinity : 0 }} 
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
                {isCapturing && (
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 rounded-none shadow-sm">
                <Camera className="w-16 h-16 mb-4" />
                <p className="text-sm text-center px-4">
                  Заснемете или изберете снимка на банкнота
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-destructive/90 text-destructive-foreground p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          {!imageBase64 ? (
            <>
              {/* Gallery button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={selectFromGallery} 
                  disabled={isCapturing} 
                  size="lg" 
                  variant="outline" 
                  className="h-16 w-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-purple-500 shadow-lg hover:bg-white dark:hover:bg-zinc-700"
                >
                  <ImageIcon className="w-7 h-7 text-black dark:text-white" />
                </Button>
              </motion.div>

              {/* Camera button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={takePhoto} 
                  disabled={isCapturing} 
                  size="lg" 
                  className="h-24 w-24 rounded-full bg-white dark:bg-zinc-800 shadow-xl disabled:opacity-50 border-0 hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  {isCapturing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <Scan className="w-10 h-10 text-primary" />
                    </motion.div>
                  ) : (
                    <CameraGradientIcon />
                  )}
                </Button>
              </motion.div>
            </>
          ) : !analysisResult ? (
            <>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={resetScan} disabled={isAnalyzing} size="lg" variant="outline" className="h-16 w-16 rounded-full bg-white/10 border-white/30 backdrop-blur-sm">
                  <RefreshCw className="w-7 h-7 text-white" />
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button onClick={handleAnalyze} disabled={isAnalyzing} size="lg" className="h-20 px-8 rounded-full gradient-primary shadow-xl disabled:opacity-50">
                  <Sparkles className="w-6 h-6 text-white mr-2" />
                  <span className="text-white font-semibold">Анализирай</span>
                </Button>
              </motion.div>
            </>
          ) : null}
        </div>
      </div>

      {/* Results panel */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div 
            initial={{ y: 300, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 300, opacity: 0 }} 
            transition={{ type: 'spring', damping: 25, stiffness: 300 }} 
            className="bg-card border-t border-border max-h-[60vh] overflow-y-auto"
          >
            {(() => {
              const config = getResultConfig(analysisResult.result);
              const Icon = config.icon;
              return (
                <div className="p-6 space-y-4">
                  {/* Result header */}
                  <div className={`flex items-center gap-4 p-4 rounded-2xl ${config.bgClass} border ${config.borderClass}`}>
                    <div className={`p-3 rounded-xl ${config.gradientClass}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl ${config.textClass}`}>
                        {config.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Увереност: {analysisResult.confidence.toFixed(0)}%
                        </span>
                        {analysisResult.currency !== 'UNKNOWN' && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm font-medium">
                              {analysisResult.currency} {analysisResult.denomination}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Analysis text */}
                  <p className="text-foreground leading-relaxed">
                    {analysisResult.analysis}
                  </p>

                  {/* Detected features */}
                  {analysisResult.detectedFeatures.length > 0 && (
                    <div>
                      <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        <Shield className="w-4 h-4" />
                        Открити защитни елементи ({analysisResult.detectedFeatures.length})
                        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      <AnimatePresence>
                        {showDetails && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: 'auto', opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }} 
                            className="mt-3 space-y-2 overflow-hidden"
                          >
                            {analysisResult.detectedFeatures.map((feature, idx) => (
                              <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${feature.detected ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                                {feature.detected ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" /> : <XOctagon className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />}
                                <div>
                                  <p className="font-medium text-sm">{feature.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysisResult.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Препоръки:</p>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-xl">
                    <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Резултатът е ориентировъчен и не представлява официална експертиза. 
                      При съмнения се обърнете към банка или експерт.
                    </p>
                  </div>

                  {/* Actions */}
                  <Button onClick={resetScan} variant="outline" className="w-full h-12 rounded-xl">
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
