import { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

interface UseCameraResult {
  photo: Photo | null;
  imageBase64: string | null;
  isCapturing: boolean;
  error: string | null;
  takePhoto: () => Promise<void>;
  selectFromGallery: () => Promise<void>;
  clearPhoto: () => void;
  setImageFromBase64: (base64: string) => void;
}

export const useCamera = (): UseCameraResult => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureImage = useCallback(async (source: CameraSource) => {
    setIsCapturing(true);
    setError(null);

    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: source,
        correctOrientation: true,
        width: 1600,
        height: 1200,
      });

      setPhoto(image);
      
      if (image.base64String) {
        const base64WithPrefix = `data:image/${image.format || 'jpeg'};base64,${image.base64String}`;
        setImageBase64(base64WithPrefix);
      }
    } catch (err) {
      console.error('Camera error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Неуспешно заснемане';
      
      // Handle user cancellation gracefully
      if (errorMessage.includes('cancelled') || errorMessage.includes('User cancelled')) {
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    await captureImage(CameraSource.Camera);
  }, [captureImage]);

  const selectFromGallery = useCallback(async () => {
    await captureImage(CameraSource.Photos);
  }, [captureImage]);

  const clearPhoto = useCallback(() => {
    setPhoto(null);
    setImageBase64(null);
    setError(null);
  }, []);

  const setImageFromBase64 = useCallback((base64: string) => {
    setImageBase64(base64);
    setPhoto(null);
    setError(null);
  }, []);

  return {
    photo,
    imageBase64,
    isCapturing,
    error,
    takePhoto,
    selectFromGallery,
    clearPhoto,
    setImageFromBase64,
  };
};
