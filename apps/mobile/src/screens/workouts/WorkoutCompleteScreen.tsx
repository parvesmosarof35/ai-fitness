import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Button } from '../../components/forms/Button';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutComplete'>;

export default function WorkoutCompleteScreen({ navigation }: Props) {
  const { currentWorkout, startTime, endWorkout } = useActiveWorkoutStore();

  const handleDone = () => {
    // In a real app, sync this completed payload to backend here before ending
    console.log('Syncing completed workout:', currentWorkout);
    endWorkout();
    navigation.popToTop(); // Go back to WorkoutList
  };

  const durationStr = startTime 
    ? Math.floor((Date.now() - startTime) / 60000) + ' min'
    : '-- min';

  // Calculate some basic stats
  let totalSets = 0;
  let totalVolume = 0;
  
  if (currentWorkout) {
    currentWorkout.exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.isCompleted) {
          totalSets += 1;
          totalVolume += (s.completedReps || 0) * (s.completedWeight || 0);
        }
      });
    });
  }

  return (
    <View className="flex-1 bg-zinc-900 pt-24 px-6 items-center">
      <View className="w-24 h-24 bg-emerald-500/20 rounded-full items-center justify-center border border-emerald-500 mb-8">
        <Text className="text-4xl">🏆</Text>
      </View>
      
      <Text className="text-4xl font-bold text-white mb-2 text-center">Workout Complete!</Text>
      <Text className="text-zinc-400 mb-12 text-center text-lg">Great job crushing your session.</Text>

      <View className="flex-row gap-4 mb-12 w-full">
        <View className="bg-zinc-800 p-4 rounded-xl flex-1 items-center border border-zinc-700">
          <Text className="text-emerald-400 font-bold text-2xl">{durationStr}</Text>
          <Text className="text-zinc-400 text-xs mt-1 font-bold">TIME</Text>
        </View>
        <View className="bg-zinc-800 p-4 rounded-xl flex-1 items-center border border-zinc-700">
          <Text className="text-emerald-400 font-bold text-2xl">{totalSets}</Text>
          <Text className="text-zinc-400 text-xs mt-1 font-bold">SETS</Text>
        </View>
        <View className="bg-zinc-800 p-4 rounded-xl flex-1 items-center border border-zinc-700">
          <Text className="text-emerald-400 font-bold text-2xl">{totalVolume}</Text>
          <Text className="text-zinc-400 text-xs mt-1 font-bold">VOL</Text>
        </View>
      </View>

      <View className="w-full absolute bottom-6 px-6">
        <Button label="Finish" onPress={handleDone} />
      </View>
    </View>
  );
}
