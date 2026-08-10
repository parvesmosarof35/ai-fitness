import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { Home, Dumbbell, Utensils, LineChart, User } from 'lucide-react-native';

// Screens
import HomeScreen from '../screens/home/HomeScreen';
import { WorkoutNavigator } from './WorkoutNavigator';
import MealScreen from '../screens/meals/MealScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090b', // zinc-950
          borderTopColor: '#27272a', // zinc-800
          paddingBottom: 10,
          paddingTop: 5,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#34d399', // emerald-400
        tabBarInactiveTintColor: '#71717a', // zinc-500
        tabBarIcon: ({ color, size }) => {
          let Icon;
          if (route.name === 'Home') Icon = Home;
          else if (route.name === 'Workouts') Icon = Dumbbell;
          else if (route.name === 'Meals') Icon = Utensils;
          else if (route.name === 'Progress') Icon = LineChart;
          else if (route.name === 'Profile') Icon = User;
          
          return Icon ? <Icon color={color} size={size} /> : null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutNavigator} />
      <Tab.Screen name="Meals" component={MealScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
