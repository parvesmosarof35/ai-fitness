import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';

const MOCK_WORKOUTS = [
  { id: '1', title: 'Full Body Power', duration: 45, difficulty: 'Intermediate' },
  { id: '2', title: 'Upper Body Pump', duration: 30, difficulty: 'Beginner' },
  { id: '3', title: 'Leg Day Core', duration: 60, difficulty: 'Advanced' },
];

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutList'>;

export default function WorkoutListScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-zinc-900 px-6 pt-16">
      <Text className="text-3xl font-bold text-white mb-8">Your Plans</Text>
      <FlatList
        data={MOCK_WORKOUTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 flex-row justify-between items-center"
            onPress={() => navigation.navigate('WorkoutOverview', { workoutId: item.id })}
          >
            <View>
              <Text className="text-xl font-bold text-white mb-1">{item.title}</Text>
              <Text className="text-zinc-400">{item.duration} min • {item.difficulty}</Text>
            </View>
            <Text className="text-emerald-400 font-bold text-2xl">→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
