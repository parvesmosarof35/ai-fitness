import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import { WorkoutNavigator } from './WorkoutNavigator';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#18181b', // zinc-900
          borderTopColor: '#27272a', // zinc-800
        },
        tabBarActiveTintColor: '#34d399', // emerald-400
        tabBarInactiveTintColor: '#a1a1aa', // zinc-400
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutNavigator} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
