import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AppProviders } from './AppProviders';
import { RootNavigator } from '../navigation/RootNavigator';
import { useAuthStore } from '../store/authStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { isRestoringToken, bootstrapAsync } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        await bootstrapAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    
    prepare();
  }, [bootstrapAsync]);

  if (isRestoringToken) {
    return null; // Return null so the native splash screen stays visible
  }

  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="light" />
    </AppProviders>
  );
}
