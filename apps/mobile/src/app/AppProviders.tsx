import { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#13121c', // Our app's background color
  },
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={customDarkTheme}>
        {children}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
