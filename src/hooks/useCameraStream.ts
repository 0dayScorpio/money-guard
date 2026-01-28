import { useState, useEffect, useRef, useCallback } from 'react';

export type CameraPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';

const CAMERA_PERMISSION_KEY = 'camera-permission-granted';

interface UseCameraStreamResult {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  permissionStatus: CameraPermissionStatus;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  startStream: () => Promise<void>;
  stopStream: () => void;
  captureFrame: () => string | null;
}

// Check if permission was previously granted and persisted
const getPersistedPermission = (): boolean => {
  try {
    return localStorage.getItem(CAMERA_PERMISSION_KEY) === 'true';
  } catch {
    return false;
  }
};

// Persist the granted permission
const persistPermission = (granted: boolean): void => {
  try {
    if (granted) {
      localStorage.setItem(CAMERA_PERMISSION_KEY, 'true');
    } else {
      localStorage.removeItem(CAMERA_PERMISSION_KEY);
    }
  } catch (error) {
    console.error('Error persisting camera permission:', error);
  }
};

export const useCameraStream = (): UseCameraStreamResult => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // Initialize with 'granted' if previously persisted, otherwise 'prompt'
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>(
    getPersistedPermission() ? 'granted' : 'prompt'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if camera is available
  const checkCameraAvailability = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionStatus('unavailable');
      return false;
    }
    return true;
  }, []);

  // Check current permission status
  const checkPermissionStatus = useCallback(async () => {
    try {
      if (!navigator.permissions) {
        // Fallback for browsers without Permissions API
        return 'prompt';
      }
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state as CameraPermissionStatus;
    } catch {
      // Some browsers don't support querying camera permission
      return 'prompt';
    }
  }, []);

  // Request camera permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const isAvailable = await checkCameraAvailability();
      if (!isAvailable) {
        setError('Камерата не е налична на това устройство');
        return false;
      }

      // Request stream to trigger permission prompt
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      // Permission granted, store stream and persist
      setStream(mediaStream);
      setPermissionStatus('granted');
      persistPermission(true);
      return true;
    } catch (err) {
      console.error('Camera permission error:', err);
      const errorName = err instanceof DOMException ? err.name : '';
      const errorMessage = err instanceof Error ? err.message : 'Грешка при достъп до камерата';
      
      // Check for permission denied (works on all platforms including iOS/Android)
      if (
        errorName === 'NotAllowedError' ||
        errorName === 'PermissionDeniedError' ||
        errorMessage.includes('Permission denied') ||
        errorMessage.includes('not allowed') ||
        errorMessage.includes('denied')
      ) {
        setPermissionStatus('denied');
        persistPermission(false); // Clear persisted permission if denied
        setError('Достъпът до камерата е отказан');
      } else if (errorName === 'NotFoundError' || errorMessage.includes('NotFoundError')) {
        setPermissionStatus('unavailable');
        setError('Камерата не е намерена');
      } else if (errorName === 'NotReadableError' || errorName === 'AbortError') {
        // Camera is in use by another app or hardware error
        setPermissionStatus('unavailable');
        setError('Камерата е заета или недостъпна');
      } else {
        // For any other error, show as denied so the user can see the retry screen
        setPermissionStatus('denied');
        setError(errorMessage);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkCameraAvailability]);

  // Start camera stream
  const startStream = useCallback(async () => {
    if (stream) {
      // Already have a stream, attach to video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      return;
    }

    const success = await requestPermission();
    if (success && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  }, [stream, requestPermission]);

  // Stop camera stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Capture current frame as base64
  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !stream) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [stream]);

  // Attach stream to video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream]);

  // Handle visibility change (pause/resume)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App in background - pause tracks but keep stream
        if (stream) {
          stream.getTracks().forEach(track => {
            track.enabled = false;
          });
        }
      } else {
        // App in foreground - resume tracks
        if (stream) {
          stream.getTracks().forEach(track => {
            track.enabled = true;
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Check initial permission status - but don't override if we already know it's denied
  useEffect(() => {
    // Skip if we already have a definitive status from a previous request
    if (permissionStatus === 'denied' || permissionStatus === 'unavailable') {
      return;
    }
    
    checkCameraAvailability().then(available => {
      if (available) {
        checkPermissionStatus().then(status => {
          // Only update if we're still in 'prompt' state
          // Don't override 'granted' from persistence
          if (permissionStatus === 'prompt' || (status === 'denied' && permissionStatus !== 'granted')) {
            setPermissionStatus(status);
          }
        });
      }
    });
  }, [checkCameraAvailability, checkPermissionStatus, permissionStatus]);

  return {
    videoRef,
    stream,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    startStream,
    stopStream,
    captureFrame,
  };
};
