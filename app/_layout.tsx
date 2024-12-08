import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/features/auth/store/auth.store';
import * as SplashScreen from 'expo-splash-screen';
import { CustomSplashScreen } from '../src/components/CustomSplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth state when app starts
  useEffect(() => {
    initializeAuth().finally(() => {
      // Hide splash screen after initialization
      SplashScreen.hideAsync();
    });
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the home page in the app group
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return <Slot />;
}
