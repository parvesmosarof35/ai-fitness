import { useEffect } from 'react';
import { useState } from 'react';
const useCameraPermission = () => ({ hasPermission: true, requestPermission: async () => true });

export function useCameraPermissions() {
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  return { hasPermission, status: hasPermission ? 'granted' : 'denied' };
}
