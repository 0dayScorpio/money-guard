import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraStream } from '@/hooks/useCameraStream';
import { CameraPermissionDenied } from './CameraPermissionDenied';
import { Loader2 } from 'lucide-react';

interface CameraBackgroundProps {
  isActive: boolean;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  onCaptureFrameReady?: (captureFrame: () => string | null) => void;
  onStreamChange?: (hasStream: boolean) => void;
  children: React.ReactNode;
  overlayOpacity?: number;
}

export const CameraBackground = ({
  isActive,
  onPermissionGranted,
  onPermissionDenied,
  onCaptureFrameReady,
  onStreamChange,
  children,
  overlayOpacity = 0.5,
}: CameraBackgroundProps) => {
  const {
    videoRef,
    stream,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    stopStream,
    captureFrame,
  } = useCameraStream();

  const hasNotifiedStreamRef = useRef(false);

  // Start camera when active and permission granted
  useEffect(() => {
    if (isActive && permissionStatus === 'granted' && !stream) {
      requestPermission();
    }
  }, [isActive, permissionStatus, stream, requestPermission]);

  // Auto-request permission when becoming active
  useEffect(() => {
    if (isActive && permissionStatus === 'prompt') {
      requestPermission();
    }
  }, [isActive, permissionStatus, requestPermission]);

  // Stop camera when inactive
  useEffect(() => {
    if (!isActive && stream) {
      stopStream();
    }
  }, [isActive, stream, stopStream]);

  // Notify parent of permission changes
  useEffect(() => {
    if (permissionStatus === 'granted') {
      onPermissionGranted?.();
    } else if (permissionStatus === 'denied') {
      onPermissionDenied?.();
    }
  }, [permissionStatus, onPermissionGranted, onPermissionDenied]);

  // Provide capture function to parent
  useEffect(() => {
    if (stream && captureFrame) {
      onCaptureFrameReady?.(captureFrame);
    }
  }, [stream, captureFrame, onCaptureFrameReady]);

  // Notify parent of stream changes
  useEffect(() => {
    const hasStream = !!stream;
    if (hasNotifiedStreamRef.current !== hasStream) {
      hasNotifiedStreamRef.current = hasStream;
      onStreamChange?.(hasStream);
    }
  }, [stream, onStreamChange]);

  const handleRetry = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  const handleOpenSettings = useCallback(() => {
    // Check if running as a native app (Capacitor)
    const isNativeApp = !!(window as any).Capacitor?.isNativePlatform?.();
    
    if (isNativeApp) {
      // Native app - open device settings directly if possible
      if (navigator.userAgent.includes('Android')) {
        alert('Отворете Настройки → Приложения → NotaGuard → Разрешения → Камера → Разреши');
      } else {
        // iOS native app
        alert('Отворете Настройки → NotaGuard → Камера → Разреши');
      }
    } else {
      // Web browser
      if (navigator.userAgent.includes('Android')) {
        alert('Отворете Настройки → Приложения → Браузър → Разрешения → Камера');
      } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        alert('Отворете Настройки → Safari → Камера → Разреши');
      } else {
        alert('Отворете настройките на браузъра и разрешете достъп до камерата за този сайт');
      }
    }
  }, []);

  // Show permission denied screen
  if (permissionStatus === 'denied' || permissionStatus === 'unavailable') {
    return (
      <div className="relative w-full h-full bg-black">
        <CameraPermissionDenied
          onRetry={handleRetry}
          onOpenSettings={handleOpenSettings}
          errorMessage={error || undefined}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Video element - always behind everything */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Dark overlay for readability */}
      <AnimatePresence>
        {stream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: overlayOpacity }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-white/80 text-sm">Зареждане на камерата...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smooth transition when camera starts */}
      <AnimatePresence>
        {!stream && !isLoading && permissionStatus === 'prompt' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black"
          />
        )}
      </AnimatePresence>

      {/* Children (UI elements) - always on top */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
