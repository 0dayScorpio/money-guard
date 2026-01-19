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
  
  return <div className="flex flex-col h-full">
      {/* Full-screen camera viewport */}
      <div className="relative flex-1 overflow-hidden">
        {/* Background - simulated live camera preview gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Animated subtle movement to simulate live feed */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
        
        {/* Semi-transparent dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {imageBase64 ? (
          // Show captured image
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img src={imageBase64} alt="Заснета банкнота" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
            
            {/* Analysis overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 mx-auto mb-4"
                  >
                    <Sparkles className="w-full h-full text-primary" />
                  </motion.div>
                  <p className="text-white text-lg font-medium">AI Анализ...</p>
                  <p className="text-white/60 text-sm mt-1">Проверка на защитни елементи</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Camera frame overlay
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[85%] max-w-sm aspect-[3/2]">
              {/* Main frame border */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-2xl" />
              
              {/* Blue corner accents */}
              <div className="absolute -top-0.5 -left-0.5 w-12 h-12 border-t-[3px] border-l-[3px] border-primary rounded-tl-2xl" />
              <div className="absolute -top-0.5 -right-0.5 w-12 h-12 border-t-[3px] border-r-[3px] border-primary rounded-tr-2xl" />
              <div className="absolute -bottom-0.5 -left-0.5 w-12 h-12 border-b-[3px] border-l-[3px] border-primary rounded-bl-2xl" />
              <div className="absolute -bottom-0.5 -right-0.5 w-12 h-12 border-b-[3px] border-r-[3px] border-primary rounded-br-2xl" />
              
              {/* Subtle glow on corners */}
              <div className="absolute -top-1 -left-1 w-14 h-14 bg-primary/20 rounded-tl-2xl blur-sm" />
              <div className="absolute -top-1 -right-1 w-14 h-14 bg-primary/20 rounded-tr-2xl blur-sm" />
              <div className="absolute -bottom-1 -left-1 w-14 h-14 bg-primary/20 rounded-bl-2xl blur-sm" />
              <div className="absolute -bottom-1 -right-1 w-14 h-14 bg-primary/20 rounded-br-2xl blur-sm" />
              
              {/* Text label inside frame */}
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <p className="text-white/80 text-center text-sm font-medium leading-relaxed">
                  Заснемете или изберете снимка на банкнота
                </p>
              </div>
              
              {/* Scanning animation when capturing */}
              <AnimatePresence>
                {isCapturing && (
                  <motion.div
                    initial={{ top: 0, opacity: 0 }}
                    animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full shadow-lg shadow-primary/50"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="bg-destructive/90 text-destructive-foreground p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action buttons - positioned below the frame */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 z-10">
          {!imageBase64 ? (
            <>
              {/* Gallery button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={selectFromGallery}
                  disabled={isCapturing}
                  size="lg"
                  variant="outline"
                  className="h-14 w-14 rounded-full bg-white/10 border-white/30 backdrop-blur-md hover:bg-white/20"
                >
                  <ImageIcon className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              {/* Camera button - highlighted */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={takePhoto}
                  disabled={isCapturing}
                  size="lg"
                  className="h-16 w-16 rounded-full gradient-primary shadow-xl shadow-primary/40 disabled:opacity-50 border-2 border-white/20"
                >
                  {isCapturing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Scan className="w-7 h-7 text-white" />
                    </motion.div>
                  ) : (
                    <Camera className="w-7 h-7 text-white" />
                  )}
                </Button>
              </motion.div>
            </>
          ) : !analysisResult ? (
            <>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={resetScan}
                  disabled={isAnalyzing}
                  size="lg"
                  variant="outline"
                  className="h-14 w-14 rounded-full bg-white/10 border-white/30 backdrop-blur-md hover:bg-white/20"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="h-16 px-8 rounded-full gradient-primary shadow-xl shadow-primary/40 disabled:opacity-50 border-2 border-white/20"
                >
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
        {analysisResult && <motion.div initial={{
        y: 300,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} exit={{
        y: 300,
        opacity: 0
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="bg-card border-t border-border max-h-[60vh] overflow-y-auto">
            {(() => {
          const config = getResultConfig(analysisResult.result);
          const Icon = config.icon;
          return <div className="p-6 space-y-4">
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
                        {analysisResult.currency !== 'UNKNOWN' && <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-sm font-medium">
                              {analysisResult.currency} {analysisResult.denomination}
                            </span>
                          </>}
                      </div>
                    </div>
                  </div>

                  {/* Analysis text */}
                  <p className="text-foreground leading-relaxed">
                    {analysisResult.analysis}
                  </p>

                  {/* Detected features */}
                  {analysisResult.detectedFeatures.length > 0 && <div>
                      <button onClick={() => setShowDetails(!showDetails)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        <Shield className="w-4 h-4" />
                        Открити защитни елементи ({analysisResult.detectedFeatures.length})
                        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      <AnimatePresence>
                        {showDetails && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} className="mt-3 space-y-2 overflow-hidden">
                            {analysisResult.detectedFeatures.map((feature, idx) => <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl ${feature.detected ? 'bg-success/10 border border-success/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                                {feature.detected ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" /> : <XOctagon className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />}
                                <div>
                                  <p className="font-medium text-sm">{feature.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {feature.description}
                                  </p>
                                </div>
                              </div>)}
                          </motion.div>}
                      </AnimatePresence>
                    </div>}

                  {/* Recommendations */}
                  {analysisResult.recommendations.length > 0 && <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Препоръки:</p>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, idx) => <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {rec}
                          </li>)}
                      </ul>
                    </div>}

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
                </div>;
        })()}
          </motion.div>}
      </AnimatePresence>
    </div>;
};