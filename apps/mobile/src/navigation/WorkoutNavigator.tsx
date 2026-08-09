import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './types';

import WorkoutListScreen from '../screens/workouts/WorkoutListScreen';
import WorkoutOverviewScreen from '../screens/workouts/WorkoutOverviewScreen';
import ActiveSessionScreen from '../screens/workouts/ActiveSessionScreen';
import CameraTrackerScreen from '../screens/workouts/CameraTrackerScreen';
import WorkoutCompleteScreen from '../screens/workouts/WorkoutCompleteScreen';

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export function WorkoutNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
      <Stack.Screen name="WorkoutOverview" component={WorkoutOverviewScreen} />
      <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
      <Stack.Screen name="CameraTracker" component={CameraTrackerScreen} />
      <Stack.Screen name="WorkoutComplete" component={WorkoutCompleteScreen} />
    </Stack.Navigator>
  );
}
