import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppProviders } from './AppProviders';
import { RootNavigator } from '../navigation/RootNavigator';
import { useAuthStore } from '../store/authStore';

export default function App() {
  const { isRestoringToken, bootstrapAsync } = useAuthStore();

  useEffect(() => {
    bootstrapAsync();
  }, [bootstrapAsync]);

  if (isRestoringToken) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#34d399" />
        <Text className="text-zinc-400 mt-4">Warming up...</Text>
      </View>
    );
  }

  return (
    <AppProviders>
      <RootNavigator />
      <StatusBar style="light" />
    </AppProviders>
  );
}
