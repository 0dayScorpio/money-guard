import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraStream } from '@/hooks/useCameraStream';
import { CameraPermissionDenied } from './CameraPermissionDenied';
import { Loader2 } from 'lucide-react';

interface CameraBackgroundProps {
  isActive: boolean;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  children: React.ReactNode;
  overlayOpacity?: number;
}

export const CameraBackground = ({
  isActive,
  onPermissionGranted,
  onPermissionDenied,
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
  } = useCameraStream();

  // Start camera when active
  useEffect(() => {
    if (isActive && permissionStatus === 'granted' && !stream) {
      requestPermission();
    }
  }, [isActive, permissionStatus, stream, requestPermission]);

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

  const handleRetry = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  const handleOpenSettings = useCallback(() => {
    // This will prompt the user to manually go to settings
    // On most mobile browsers, we can't programmatically open settings
    // But we can provide instructions
    if (navigator.userAgent.includes('Android')) {
      alert('Отворете Настройки → Приложения → Браузър → Разрешения → Камера');
    } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      alert('Отворете Настройки → Safari → Камера → Разреши');
    } else {
      alert('Отворете настройките на браузъра и разрешете достъп до камерата за този сайт');
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
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
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
