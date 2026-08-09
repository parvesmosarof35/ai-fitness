import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
