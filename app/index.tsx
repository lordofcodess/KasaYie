import { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform, View, Image } from 'react-native';

// Mock implementation for web
const mockStorage: Record<string, string> = {};

async function getItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    console.log('Web: Getting', key, '=', mockStorage[key]);
    return mockStorage[key] || null;
  }
  const value = await SecureStore.getItemAsync(key);
  console.log('Native: Getting', key, '=', value);
  return value;
}

async function setItemAsync(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    console.log('Web: Setting', key, '=', value);
    mockStorage[key] = value;
    return;
  }
  console.log('Native: Setting', key, '=', value);
  return await SecureStore.setItemAsync(key, value);
}

async function resetOnboarding(): Promise<void> {
  await setItemAsync('hasLaunched', 'false');
  console.log('Onboarding state reset');
}

export default function Index() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkFirstLaunch() {
      // Uncomment the next line to force onboarding
      await resetOnboarding();
      
      const hasLaunched = await getItemAsync('hasLaunched');
      console.log('hasLaunched value:', hasLaunched);
      setIsFirstLaunch(hasLaunched !== 'true');
    }

    checkFirstLaunch();
  }, []);

  // Still loading
  if (isFirstLaunch === null) {
    console.log('Still loading...');
    return null;
  }

  // First time user, show onboarding
  if (isFirstLaunch) {
    console.log('First launch, redirecting to onboarding');
    return <Redirect href="/onboarding/splash" />;
  }

  // Returning user, go to main app
  console.log('Returning user, redirecting to tabs');
  return <Redirect href="/(tabs)" />;
}