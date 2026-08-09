import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Button } from '../../components/forms/Button';
import { ExerciseSet } from '../../schemas/workout';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'ActiveSession'>;

export default function ActiveSessionScreen({ navigation }: Props) {
  const { 
    currentWorkout, 
    currentExerciseIndex, 
    logSet, 
    nextExercise, 
    prevExercise,
  } = useActiveWorkoutStore();

  const [restTimer, setRestTimer] = useState<number | null>(null);

  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;
    const interval = setInterval(() => {
      setRestTimer((t) => (t !== null && t > 0 ? t - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer]);

  if (!currentWorkout) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-white mb-4">No active workout found.</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const exercise = currentWorkout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === currentWorkout.exercises.length - 1;

  const handleFinish = () => {
    navigation.replace('WorkoutComplete');
  };

  const handleLogSet = (setId: string, reps: string, weight: string) => {
    logSet(exercise.id, setId, parseInt(reps, 10) || 0, parseInt(weight, 10) || 0);
    setRestTimer(exercise.restSecondsBetweenSets);
  };

  return (
    <View className="flex-1 bg-zinc-900 pt-16">
      <View className="px-6 flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={prevExercise} disabled={currentExerciseIndex === 0}>
          <Text className={`font-bold ${currentExerciseIndex === 0 ? 'text-zinc-600' : 'text-emerald-400'}`}>← Prev</Text>
        </TouchableOpacity>
        <Text className="text-zinc-400 font-bold">
          {currentExerciseIndex + 1} / {currentWorkout.exercises.length}
        </Text>
        <TouchableOpacity onPress={nextExercise} disabled={isLastExercise}>
          <Text className={`font-bold ${isLastExercise ? 'text-zinc-600' : 'text-emerald-400'}`}>Skip →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>
        <View className="flex-row justify-between items-start mb-8">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-white mb-2">{exercise.name}</Text>
            <Text className="text-zinc-400 font-semibold">{exercise.muscleGroup}</Text>
          </View>
          <TouchableOpacity 
            className="bg-emerald-500/20 border border-emerald-500 px-4 py-2 rounded-lg ml-4"
            onPress={() => navigation.navigate('CameraTracker', { exerciseName: exercise.name })}
          >
            <Text className="text-emerald-400 font-bold">AI Track</Text>
          </TouchableOpacity>
        </View>

        {restTimer !== null && restTimer > 0 && (
          <View className="bg-emerald-500/20 p-4 rounded-xl border border-emerald-500 mb-8 items-center">
            <Text className="text-emerald-400 font-bold mb-1">Rest Timer</Text>
            <Text className="text-4xl font-bold text-white">{restTimer}s</Text>
            <TouchableOpacity className="mt-2" onPress={() => setRestTimer(null)}>
              <Text className="text-zinc-400 font-semibold underline">Skip Rest</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row justify-between px-2 mb-4">
          <Text className="text-zinc-400 font-bold w-12">Set</Text>
          <Text className="text-zinc-400 font-bold flex-1 text-center">Weight</Text>
          <Text className="text-zinc-400 font-bold flex-1 text-center">Reps</Text>
          <Text className="text-zinc-400 font-bold w-12 text-right">Log</Text>
        </View>

        {exercise.sets.map((set, idx) => (
          <SetRow 
            key={set.id} 
            index={idx} 
            set={set} 
            onLog={(reps, weight) => handleLogSet(set.id, reps, weight)} 
          />
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 p-6 bg-zinc-900 border-t border-zinc-800">
        {isLastExercise ? (
          <Button label="Finish Workout" onPress={handleFinish} />
        ) : (
          <Button label="Next Exercise" onPress={nextExercise} />
        )}
      </View>
    </View>
  );
}

function SetRow({ set, index, onLog }: { set: ExerciseSet, index: number, onLog: (reps: string, weight: string) => void }) {
  const [reps, setReps] = useState(set.completedReps?.toString() || set.reps?.toString() || '');
  const [weight, setWeight] = useState(set.completedWeight?.toString() || set.weight?.toString() || '');

  return (
    <View className={`flex-row justify-between items-center mb-4 p-4 rounded-xl border ${set.isCompleted ? 'bg-emerald-500/10 border-emerald-500' : 'bg-zinc-800 border-zinc-700'}`}>
      <Text className="text-white font-bold w-12">{index + 1}</Text>
      
      <View className="flex-1 px-2">
        <TextInput 
          className="bg-zinc-900 text-white p-3 rounded-lg text-center font-bold"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          placeholder="-"
          placeholderTextColor="#71717a"
        />
      </View>

      <View className="flex-1 px-2">
        <TextInput 
          className="bg-zinc-900 text-white p-3 rounded-lg text-center font-bold"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
          placeholder="-"
          placeholderTextColor="#71717a"
        />
      </View>

      <TouchableOpacity 
        className="w-12 h-12 bg-zinc-900 rounded-lg items-center justify-center border border-zinc-700"
        onPress={() => onLog(reps, weight)}
      >
        <Text className={set.isCompleted ? 'text-emerald-400 text-xl font-bold' : 'text-zinc-400 text-xl font-bold'}>
          {set.isCompleted ? '✓' : '+'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
