import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';

export const useNativeCamera = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const isNative = Capacitor.isNativePlatform();

  const recordVideo = async (): Promise<File | null> => {
    if (!isNative) {
      toast({
        title: "Native feature",
        description: "Video recording with native camera is only available on mobile devices",
      });
      return null;
    }

    try {
      setIsRecording(true);
      
      // Request camera permissions
      const permissions = await Camera.requestPermissions();
      if (permissions.camera !== 'granted') {
        toast({
          title: "Permission denied",
          description: "Camera permission is required to record videos",
          variant: "destructive",
        });
        return null;
      }

      // On native platforms, use the device's video recorder
      // Note: Capacitor Camera plugin currently supports photos
      // For video, you'd typically use a custom plugin or Capacitor Video plugin
      toast({
        title: "Coming soon",
        description: "Native video recording will be available in the next update",
      });
      
      return null;
    } catch (error) {
      console.error('Error recording video:', error);
      toast({
        title: "Recording failed",
        description: "Failed to record video. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsRecording(false);
    }
  };

  const takePicture = async (): Promise<string | null> => {
    if (!isNative) {
      return null;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return image.webPath || null;
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Camera failed",
        description: "Failed to take picture. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isNative,
    isRecording,
    recordVideo,
    takePicture,
  };
};
