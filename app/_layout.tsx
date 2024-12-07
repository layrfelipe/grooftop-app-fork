import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/features/auth/store/auth.store';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Initialize auth state when app starts
  useEffect(() => {
    initializeAuth();
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
