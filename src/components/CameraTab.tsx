import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  Shield,
  CheckCircle,
  XOctagon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BanknotePreviewImage } from "@/components/ui/responsive-image";
import { ScanHistory } from "@/types";
import { useCamera } from "@/hooks/useCamera";
import { useBanknoteAnalysis, AnalysisResult } from "@/hooks/useBanknoteAnalysis";
import { CameraBackground } from "./CameraBackground";
import { PrivacyConsentScreen } from "./PrivacyConsentScreen";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ScannerFrame } from "./ScannerFrame";

interface CameraTabProps {
  onScanComplete: (scan: ScanHistory) => void;
}

export const CameraTab = ({ onScanComplete }: CameraTabProps) => {
  const {
    imageBase64,
    isCapturing,
    error: cameraError,
    takePhoto,
    selectFromGallery,
    clearPhoto,
    setImageFromBase64,
  } = useCamera();
  const { analysisResult, isAnalyzing, error: analysisError, analyzeImage, clearAnalysis } = useBanknoteAnalysis();
  const [showDetails, setShowDetails] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useLocalStorage("camera-privacy-accepted", false);
  const [showPrivacyScreen, setShowPrivacyScreen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Ref to capture function from CameraBackground
  const captureFrameRef = useRef<(() => string | null) | null>(null);
  const hasStreamRef = useRef(false);

  // Check if we need to show privacy screen on mount
  useEffect(() => {
    if (!hasAcceptedPrivacy) {
      setShowPrivacyScreen(true);
    } else {
      setIsCameraActive(true);
    }
  }, [hasAcceptedPrivacy]);

  const handlePrivacyAccept = useCallback(() => {
    setHasAcceptedPrivacy(true);
    setShowPrivacyScreen(false);
    setIsCameraActive(true);
  }, [setHasAcceptedPrivacy]);

  const handlePrivacyDecline = useCallback(() => {
    setShowPrivacyScreen(false);
    // Still allow them to use gallery even if they decline camera
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64) return;
    const result = await analyzeImage(imageBase64);
    if (result) {
      const scan: ScanHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result: result.result,
        currency: result.currency,
        denomination: result.denomination?.toString() || "Неизвестен",
        confidence: result.confidence,
      };
      onScanComplete(scan);
    }
  }, [imageBase64, analyzeImage, onScanComplete]);

  const resetScan = useCallback(() => {
    clearPhoto();
    clearAnalysis();
    setShowDetails(false);
  }, [clearPhoto, clearAnalysis]);

  // Capture from live stream or fallback to native camera
  const handleCaptureFromStream = useCallback(() => {
    if (hasStreamRef.current && captureFrameRef.current) {
      const frame = captureFrameRef.current();
      if (frame) {
        setImageFromBase64(frame);
        return;
      }
    }
    // Fallback to native camera
    takePhoto();
  }, [setImageFromBase64, takePhoto]);

  // Callbacks for CameraBackground
  const handleCaptureFrameReady = useCallback((captureFrame: () => string | null) => {
    captureFrameRef.current = captureFrame;
  }, []);

  const handleStreamChange = useCallback((hasStream: boolean) => {
    hasStreamRef.current = hasStream;
  }, []);

  const getResultConfig = (result: AnalysisResult["result"]) => {
    switch (result) {
      case "authentic":
        return {
          icon: CheckCircle2,
          title: "Вероятно истинска",
          description: "Банкнотата показва очаквани защитни характеристики.",
          bgClass: "bg-success/10 dark:bg-success/20",
          textClass: "text-success",
          borderClass: "border-success/30",
          gradientClass: "gradient-success",
        };
      case "suspicious":
        return {
          icon: AlertTriangle,
          title: "Съмнителна",
          description: "Открити са някои несъответствия. Проверете отново ръчно.",
          bgClass: "bg-warning/10 dark:bg-warning/20",
          textClass: "text-warning",
          borderClass: "border-warning/30",
          gradientClass: "gradient-warning",
        };
      case "fake":
        return {
          icon: XCircle,
          title: "Възможно фалшива",
          description: "Открити са сериозни несъответствия с оригинала.",
          bgClass: "bg-destructive/10 dark:bg-destructive/20",
          textClass: "text-destructive",
          borderClass: "border-destructive/30",
          gradientClass: "gradient-danger",
        };
      default:
        return {
          icon: AlertCircle,
          title: "Неизвестен резултат",
          description: "Не може да се определи резултата от анализа.",
          bgClass: "bg-muted/10 dark:bg-muted/20",
          textClass: "text-muted-foreground",
          borderClass: "border-muted/30",
          gradientClass: "gradient-primary",
        };
    }
  };

  const error = cameraError || analysisError;

  // SVG gradient for scan icon - larger camera icon
  const ScanGradientIcon = ({ useGradient = false }: { useGradient?: boolean }) => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cameraGradientFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(270, 70%, 70%)" />
          <stop offset="50%" stopColor="hsl(265, 80%, 60%)" />
          <stop offset="100%" stopColor="hsl(258, 85%, 55%)" />
        </linearGradient>
      </defs>
      {useGradient ? (
        <>
          {/* Light mode: filled gradient camera with white lens */}
          <path 
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" 
            fill="url(#cameraGradientFill)"
          />
          <circle cx="12" cy="13" r="4" fill="white" />
        </>
      ) : (
        <>
          {/* Dark mode: white outline camera */}
          <path 
            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" 
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="2" fill="none" />
        </>
      )}
    </svg>
  );

  // Show privacy consent screen
  if (showPrivacyScreen) {
    return <PrivacyConsentScreen onAccept={handlePrivacyAccept} onDecline={handlePrivacyDecline} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Camera viewport with live background */}
      <CameraBackground
        isActive={isCameraActive && !imageBase64}
        overlayOpacity={0.45}
        onPermissionGranted={() => setIsCameraActive(true)}
        onCaptureFrameReady={handleCaptureFrameReady}
        onStreamChange={handleStreamChange}
      >
        <div className="relative flex-1 h-full overflow-hidden">
          {imageBase64 ? (
            // Show captured image
            <div className="absolute inset-0 bg-black/80">
              <BanknotePreviewImage
                src={imageBase64}
                alt="Заснета банкнота"
              />

              {/* Analysis overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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
            // Camera viewfinder overlay with modern scanner frame
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Scanner Frame with glowing corners */}
              <ScannerFrame 
                isScanning={isCapturing} 
                isSuccess={!!analysisResult && analysisResult.result === 'authentic'}
              />

              {/* Instruction text - positioned below frame */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <p className="text-white/90 text-sm text-center px-6 py-2.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                  Позиционирайте банкнотата в рамката
                </p>
              </motion.div>
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

          {/* Action buttons */}
          <div className="absolute bottom-8 left-0 right-0 flex items-end justify-center gap-6 z-20 px-4">
            {!imageBase64 ? (
              <>
                {/* Gallery button - secondary, smaller */}
                <motion.div 
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Button
                    onClick={selectFromGallery}
                    disabled={isCapturing}
                    size="lg"
                    variant="outline"
                    className="h-14 w-14 rounded-full shadow-lg transition-all duration-300
                      dark:bg-black/30 dark:backdrop-blur-md dark:border-white/20 dark:hover:bg-black/40 dark:hover:border-white/30
                      bg-white border-black/10 hover:bg-white/90"
                  >
                    <ImageIcon className="w-6 h-6 dark:text-white/90 text-black" />
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs dark:text-white/60 text-white/80 whitespace-nowrap">
                    Галерия
                  </span>
                </motion.div>

                {/* Scan button - primary, large and emphasized */}
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  {/* Dark mode: gradient background with glow */}
                  <div className="dark:block hidden absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 blur-lg opacity-60 animate-pulse" />
                  <Button
                    onClick={handleCaptureFromStream}
                    disabled={isCapturing}
                    size="lg"
                    className="relative h-20 w-20 rounded-full shadow-2xl disabled:opacity-50 transition-all duration-300
                      dark:bg-gradient-to-br dark:from-violet-500 dark:via-purple-500 dark:to-indigo-500 dark:border-2 dark:border-white/20 dark:hover:from-violet-400 dark:hover:via-purple-400 dark:hover:to-indigo-400
                      bg-white border border-black/10 hover:bg-white/90"
                    style={{
                      boxShadow: "0 0 30px rgba(139, 92, 246, 0.3), 0 10px 40px rgba(0, 0, 0, 0.2)"
                    }}
                  >
                    {isCapturing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Scan className="w-10 h-10 dark:text-white text-violet-500" />
                      </motion.div>
                    ) : (
                      <>
                        {/* Dark mode: white camera icon */}
                        <span className="dark:block hidden">
                          <ScanGradientIcon useGradient={false} />
                        </span>
                        {/* Light mode: gradient camera icon */}
                        <span className="dark:hidden block">
                          <ScanGradientIcon useGradient={true} />
                        </span>
                      </>
                    )}
                  </Button>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs dark:text-white/80 text-white/90 font-medium whitespace-nowrap">
                    Сканирай
                  </span>
                </motion.div>

                {/* Spacer for visual balance */}
                <div className="w-14 h-14" />
              </>
            ) : !analysisResult ? (
              <>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={resetScan}
                    disabled={isAnalyzing}
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 rounded-full bg-white/10 border-white/30 backdrop-blur-sm"
                  >
                    <RefreshCw className="w-7 h-7 text-white" />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    size="lg"
                    className="h-20 px-8 rounded-full gradient-primary shadow-xl disabled:opacity-50"
                  >
                    <Sparkles className="w-6 h-6 text-white mr-2" />
                    <span className="text-white font-semibold">Анализирай</span>
                  </Button>
                </motion.div>
              </>
            ) : null}
          </div>
        </div>
      </CameraBackground>

      {/* Results panel */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-card border-t border-border max-h-[60vh] overflow-y-auto"
          >
            {(() => {
              const config = getResultConfig(analysisResult.result);
              const Icon = config.icon;
              return (
                <div className="p-6 space-y-4">
                  {/* Result header */}
                  <div
                    className={`flex items-center gap-4 p-4 rounded-2xl ${config.bgClass} border ${config.borderClass}`}
                  >
                    <div className={`p-3 rounded-xl ${config.gradientClass}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold text-xl ${config.textClass}`}>{config.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Увереност: {analysisResult.confidence.toFixed(0)}%
                        </span>
                        {analysisResult.currency !== "UNKNOWN" && (
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
                  <p className="text-foreground leading-relaxed">{analysisResult.analysis}</p>

                  {/* Detected features */}
                  {analysisResult.detectedFeatures.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <Shield className="w-4 h-4" />
                        Открити защитни елементи ({analysisResult.detectedFeatures.length})
                        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <AnimatePresence>
                        {showDetails && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 space-y-2 overflow-hidden"
                          >
                            {analysisResult.detectedFeatures.map((feature, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start gap-3 p-3 rounded-xl ${feature.detected ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}
                              >
                                {feature.detected ? (
                                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                ) : (
                                  <XOctagon className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{feature.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
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
                      Резултатът е ориентировъчен и не представлява официална експертиза. При съмнения се обърнете към
                      банка или експерт.
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
