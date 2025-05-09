import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to handle framework-specific initialization
 */
export function useFrameworkReady() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add any web-specific initialization here
      return;
    }

    // Add any native-specific initialization here
  }, []);
} 