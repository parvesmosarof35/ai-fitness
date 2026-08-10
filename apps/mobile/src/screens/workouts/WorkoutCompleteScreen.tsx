import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Button } from '../../components/forms/Button';
import { Check, Clock, Dumbbell, Flame } from 'lucide-react-native';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutComplete'>;

export default function WorkoutCompleteScreen({ navigation }: Props) {
  const { plan, startTime, completedSets, abortWorkout, state } = useActiveWorkoutStore();

  const handleDone = () => {
    abortWorkout(); // Resets the active session state
    navigation.popToTop(); // Go back to WorkoutList
  };

  const durationMinutes = startTime 
    // eslint-disable-next-line react-hooks/purity
    ? Math.max(1, Math.floor((Date.now() - startTime) / 60000))
    : 0;

  const totalSets = completedSets.length;
  let totalVolume = 0;
  
  completedSets.forEach(s => {
    totalVolume += (s.reps || 0) * (s.weightKg || 0);
  });

  return (
    <View className="flex-1 bg-zinc-950 pt-24 px-6 items-center">
      <View className="w-24 h-24 bg-brand-cyan/20 rounded-full items-center justify-center border-4 border-brand-cyan mb-8 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
        <Check color="#22d3ee" size={48} strokeWidth={3} />
      </View>
      
      <Text className="text-4xl font-black text-white mb-2 text-center tracking-tight">Workout Complete</Text>
      <Text className="text-zinc-400 mb-2 text-center font-medium">
        {plan?.title || "Your Workout"}
      </Text>
      
      {state === 'sync_failed' && (
         <Text className="text-brand-orange font-bold text-xs mb-8">Waiting to sync...</Text>
      )}
      {state === 'synced' && (
         <Text className="text-brand-cyan font-bold text-xs mb-8">Progress saved to profile.</Text>
      )}

      <View className="flex-row flex-wrap gap-4 mb-12 w-full justify-center">
        <View className="bg-surface-highlight p-5 rounded-3xl flex-1 min-w-[40%] items-center border border-white/5 shadow-lg">
          <Clock color="#a1a1aa" size={24} className="mb-3" />
          <Text className="text-white font-black text-3xl">{durationMinutes}</Text>
          <Text className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1 font-bold">Minutes</Text>
        </View>
        <View className="bg-surface-highlight p-5 rounded-3xl flex-1 min-w-[40%] items-center border border-white/5 shadow-lg">
          <Check color="#a1a1aa" size={24} className="mb-3" />
          <Text className="text-white font-black text-3xl">{totalSets}</Text>
          <Text className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1 font-bold">Sets</Text>
        </View>
        
        {totalVolume > 0 && (
          <View className="bg-surface-highlight p-5 rounded-3xl flex-1 min-w-[40%] items-center border border-white/5 shadow-lg">
            <Dumbbell color="#a1a1aa" size={24} className="mb-3" />
            <Text className="text-white font-black text-3xl">{totalVolume}</Text>
            <Text className="text-zinc-500 text-[10px] uppercase tracking-wider mt-1 font-bold">Volume (kg)</Text>
          </View>
        )}
      </View>

      <View className="w-full absolute bottom-8 px-6">
        <Button label="Done" onPress={handleDone} variant="primary" size="lg" />
      </View>
    </View>
  );
}
