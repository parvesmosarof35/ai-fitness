import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '../store/authStore';

// Navigators
import { AuthNavigator } from './AuthNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';

import { IntroScreen } from '../screens/intro/IntroScreen';
import CoachChatScreen from '../screens/coach/CoachChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, hasCompletedOnboarding, hasSeenIntro } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenIntro ? (
        // User has never seen the intro splash screens
        <Stack.Screen name="Intro" component={IntroScreen} />
      ) : !isAuthenticated ? (
        // User is not signed in
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !hasCompletedOnboarding ? (
        // User is signed in but hasn't completed onboarding
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        // User is signed in and has completed onboarding
        <Stack.Group>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="AICoachChat" component={CoachChatScreen} options={{ presentation: 'fullScreenModal' }} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
