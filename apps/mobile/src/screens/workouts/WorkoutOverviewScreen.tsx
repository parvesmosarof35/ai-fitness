import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { WorkoutPlan } from '../../schemas/workout';
import { Button } from '../../components/forms/Button';

// Mock detailed workout
const MOCK_WORKOUT_DETAILS: Record<string, WorkoutPlan> = {
  '1': {
    id: '1',
    title: 'Full Body Power',
    description: 'A comprehensive full body routine targeting major muscle groups.',
    estimatedDurationMinutes: 45,
    difficulty: 'intermediate',
    exercises: [
      {
        id: 'e1',
        name: 'Barbell Squats',
        muscleGroup: 'Legs',
        restSecondsBetweenSets: 60,
        sets: [
          { id: 's1', reps: 10, weight: 60, isCompleted: false },
          { id: 's2', reps: 10, weight: 60, isCompleted: false },
        ]
      },
      {
        id: 'e2',
        name: 'Push Ups',
        muscleGroup: 'Chest',
        restSecondsBetweenSets: 45,
        sets: [
          { id: 's3', reps: 15, isCompleted: false },
          { id: 's4', reps: 15, isCompleted: false },
        ]
      }
    ]
  }
};

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutOverview'>;

export default function WorkoutOverviewScreen({ route, navigation }: Props) {
  const { workoutId } = route.params;
  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  
  // For now, if the ID isn't '1', we just fallback to '1'
  const workout = MOCK_WORKOUT_DETAILS[workoutId] || MOCK_WORKOUT_DETAILS['1'];

  const onStart = () => {
    startWorkout(workout);
    navigation.navigate('ActiveSession');
  };

  return (
    <View className="flex-1 bg-zinc-900 pt-16">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
          <Text className="text-emerald-400 font-bold">← Back</Text>
        </TouchableOpacity>
        
        <Text className="text-4xl font-bold text-white mb-2">{workout.title}</Text>
        <Text className="text-zinc-400 mb-6">{workout.description}</Text>
        
        <View className="flex-row gap-4 mb-8">
          <View className="bg-zinc-800 p-4 rounded-xl flex-1 items-center">
            <Text className="text-emerald-400 font-bold text-xl">{workout.estimatedDurationMinutes}m</Text>
            <Text className="text-zinc-400 text-xs mt-1 font-bold">DURATION</Text>
          </View>
          <View className="bg-zinc-800 p-4 rounded-xl flex-1 items-center">
            <Text className="text-emerald-400 font-bold text-xl capitalize">{workout.difficulty}</Text>
            <Text className="text-zinc-400 text-xs mt-1 font-bold">DIFFICULTY</Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-white mb-4">Exercises</Text>
        {workout.exercises.map((ex, index) => (
          <View key={ex.id} className="bg-zinc-800 p-4 rounded-xl mb-4 border border-zinc-700">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-white">{index + 1}. {ex.name}</Text>
              <Text className="text-zinc-400 font-semibold">{ex.sets.length} Sets</Text>
            </View>
            <Text className="text-emerald-400 font-semibold text-sm">{ex.muscleGroup}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-zinc-900 border-t border-zinc-800">
        <Button label="Start Workout" onPress={onStart} />
      </View>
    </View>
  );
}
