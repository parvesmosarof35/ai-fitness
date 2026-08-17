import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { useWorkouts } from '../../hooks/useWorkouts';
import { Button } from '../../components/forms/Button';
import { Clock, Flame, Dumbbell, Zap } from 'lucide-react-native';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'WorkoutOverview'>;

export default function WorkoutOverviewScreen({ route, navigation }: Props) {
  const { workoutId } = route.params;
  const { plans, loading } = useWorkouts();
  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  
  const workout = useMemo(() => plans.find(p => p.id === workoutId), [plans, workoutId]);

  if (loading) {
    return (
      <ForgeBackground>
        <ForgeHeader onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#43E6D0" />
        </View>
      </ForgeBackground>
    );
  }

  if (!workout) {
    return (
      <ForgeBackground>
        <ForgeHeader onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#F7F5FF', fontFamily: 'System', fontWeight: '900', fontSize: 24, marginBottom: 16 }}>Not Found</Text>
          <Button label="Go Back" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
      </ForgeBackground>
    );
  }

  const onStart = async () => {
    await startWorkout(workout);
    navigation.navigate('ActiveSession');
  };

  return (
    <ForgeBackground showCyanGlow={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* Hero Artwork */}
        <View style={styles.heroContainer}>
          <Dumbbell color="#1B1B2A" size={100} style={styles.heroIcon} />
          <LinearGradient
            colors={['rgba(11, 11, 19, 0)', '#0B0B13']}
            style={styles.heroOverlay}
          />
          <View style={styles.headerWrapper}>
            <ForgeHeader onBack={() => navigation.goBack()} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: -40 }}>
          
          {/* Title */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginBottom: 24 }}>
            <Text style={styles.title}>{workout.title.toUpperCase()}</Text>
            {workout.description ? (
              <Text style={styles.description}>{workout.description}</Text>
            ) : null}
          </Animated.View>

          {/* Metrics */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.metricsGrid}>
            <GlassCard style={styles.metricCard}>
              <Clock color="#43E6D0" size={20} />
              <View style={styles.metricTextContainer}>
                <Text style={styles.metricValue}>{workout.estimatedDurationMinutes}M</Text>
                <Text style={styles.metricLabel}>TIME</Text>
              </View>
            </GlassCard>
            
            <GlassCard style={styles.metricCard}>
              <Zap color="#665CFF" size={20} />
              <View style={styles.metricTextContainer}>
                <Text style={styles.metricValue}>{workout.difficulty}</Text>
                <Text style={styles.metricLabel}>LEVEL</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.metricCard}>
              <Flame color="#FF8A4C" size={20} />
              <View style={styles.metricTextContainer}>
                <Text style={styles.metricValue}>{workout.estimatedCalories || '--'}</Text>
                <Text style={styles.metricLabel}>KCAL</Text>
              </View>
            </GlassCard>

            <GlassCard style={styles.metricCard}>
              <Dumbbell color="#AAA7BA" size={20} />
              <View style={styles.metricTextContainer}>
                <Text style={styles.metricValue}>{workout.exercises.length}</Text>
                <Text style={styles.metricLabel}>EXERCISES</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Exercises */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginTop: 32 }}>
            <Text style={styles.sectionTitle}>ROUTINE</Text>
            <View style={{ gap: 12 }}>
              {workout.exercises.map((ex, index) => (
                <GlassCard key={ex.id || index.toString()} style={styles.exerciseCard}>
                  <View style={styles.exerciseThumbnail}>
                    <Text style={styles.exerciseIndex}>{index + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName} numberOfLines={1}>{ex.name}</Text>
                    <View style={styles.exerciseMetaRow}>
                      <Text style={styles.exerciseMeta}>{ex.targetSets} SETS</Text>
                      <View style={styles.dot} />
                      <Text style={styles.exerciseMeta}>{ex.targetReps ? `${ex.targetReps} REPS` : `${ex.targetDurationSeconds} SEC`}</Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.exerciseMuscle}>{ex.muscleGroup || 'FULL BODY'}</Text>
                  </View>
                </GlassCard>
              ))}
            </View>
          </Animated.View>

        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyCTA}>
        <LinearGradient
          colors={['transparent', '#0B0B13', '#0B0B13']}
          style={StyleSheet.absoluteFill}
        />
        <Button label="Start Workout" onPress={onStart} variant="primary" size="lg" />
      </View>
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 320,
    backgroundColor: 'rgba(102, 92, 255, 0.1)',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    opacity: 0.5,
  },
  heroOverlay: {
    ...(StyleSheet.absoluteFill as any),
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    color: '#F7F5FF',
    lineHeight: 44,
    letterSpacing: -1,
    textShadowColor: 'rgba(102, 92, 255, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  description: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  metricTextContainer: {
    flex: 1,
  },
  metricValue: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  metricLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  exerciseThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIndex: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 18,
  },
  exerciseName: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseMeta: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#696678',
  },
  exerciseMuscle: {
    color: '#665CFF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stickyCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 90,
    paddingTop: 16,
  }
});
