import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Button } from '../../components/forms/Button';
import { Check, Clock, Dumbbell, Trophy } from 'lucide-react-native';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { GlassCard } from '../../components/ui/GlassCard';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutComplete'>;

export default function WorkoutCompleteScreen({ navigation }: Props) {
  const { plan, startTime, completedSets, abortWorkout, state } = useActiveWorkoutStore();

  const handleDone = () => {
    abortWorkout(); // Resets the active session state
    navigation.popToTop(); // Go back to WorkoutList
  };

  const durationMinutes = startTime 
    // eslint-disable-next-line react-hooks/purity
    ? Math.max(1, Math.floor((Date.now() - new Date(startTime).getTime()) / 60000))
    : 0;

  const totalSets = completedSets.length;
  let totalVolume = 0;
  
  completedSets.forEach(s => {
    totalVolume += (s.reps || 0) * (s.weightKg || 0);
  });

  return (
    <ForgeBackground>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, alignItems: 'center' }}>
        
        {/* Success Icon */}
        <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(66, 232, 207, 0.15)', borderWidth: 2, borderColor: '#42E8CF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Check color="#42E8CF" size={40} strokeWidth={3} />
        </View>
        
        <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', textAlign: 'center', letterSpacing: -0.5, marginBottom: 6 }}>Workout Complete!</Text>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#A7ADBC', textAlign: 'center', marginBottom: 16 }}>
          {plan?.title || "Your Workout"}
        </Text>
        
        {state === 'save_failed' && (
           <Text style={{ color: '#FF6B78', fontWeight: '800', fontSize: 12, marginBottom: 24 }}>Could not save workout on this device.</Text>
        )}
        {state === 'completed' && (
           <Text style={{ color: '#42E8CF', fontWeight: '800', fontSize: 12, marginBottom: 24 }}>Workout saved to your training history.</Text>
        )}

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%', marginBottom: 32 }}>
          <GlassCard style={{ flex: 1, minWidth: '40%' }} contentStyle={{ alignItems: 'center', padding: 20 }}>
            <Clock color="#7C6CFF" size={22} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#F5F7FC' }}>{durationMinutes}</Text>
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#6F7687', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>MINUTES</Text>
          </GlassCard>

          <GlassCard style={{ flex: 1, minWidth: '40%' }} contentStyle={{ alignItems: 'center', padding: 20 }}>
            <Trophy color="#42E8CF" size={22} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#F5F7FC' }}>{totalSets}</Text>
            <Text style={{ fontSize: 10, fontWeight: '800', color: '#6F7687', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>SETS DONE</Text>
          </GlassCard>
          
          {totalVolume > 0 && (
            <GlassCard style={{ width: '100%' }} contentStyle={{ alignItems: 'center', padding: 20 }}>
              <Dumbbell color="#FF9B6A" size={22} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 28, fontWeight: '900', color: '#F5F7FC' }}>{totalVolume} kg</Text>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#6F7687', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>TOTAL VOLUME</Text>
            </GlassCard>
          )}
        </View>

        <View style={{ width: '100%', position: 'absolute', bottom: 40, left: 24, right: 24 }}>
          <Button label="DONE" onPress={handleDone} variant="primary" size="lg" />
        </View>
      </View>
    </ForgeBackground>
  );
}
