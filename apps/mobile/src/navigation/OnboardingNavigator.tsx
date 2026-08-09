import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import OnboardingStartScreen from '../screens/onboarding/OnboardingStartScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingStart" component={OnboardingStartScreen} />
    </Stack.Navigator>
  );
}
