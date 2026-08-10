import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Button } from '../../components/forms/Button';
import { Check, Pause, Play, X, Info } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut, useAnimatedStyle, useSharedValue, withTiming, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'ActiveSession'>;

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = width * 0.3;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function ActiveSessionScreen({ navigation }: Props) {
  const { 
    state,
    plan,
    currentExerciseIndex,
    currentSetIndex,
    completedSets,
    getCurrentExercise,
    completeSet,
    skipRest,
    finishWorkout,
    abortWorkout,
    restEndTimestamp,
    pauseWorkout,
    resumeWorkout
  } = useActiveWorkoutStore();

  const insets = useSafeAreaInsets();
  const [restTimeRemaining, setRestTimeRemaining] = useState<number | null>(null);
  const [initialRestTime, setInitialRestTime] = useState<number>(60); // Default 60s
  
  const [currentReps, setCurrentReps] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');

  const progressValue = useSharedValue(1);

  useEffect(() => {
    if (state === 'synced' || state === 'sync_failed') {
      navigation.replace('WorkoutComplete');
    }
  }, [state, navigation]);

  useEffect(() => {
    if (state !== 'resting' || !restEndTimestamp) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestTimeRemaining(null);
      progressValue.value = 1;
      return;
    }
    
    // Simple heuristic to get the total rest time based on when the timer started.
    // If we just entered rest state, compute initial rest time.
    const timeRemaining = Math.max(0, Math.ceil((restEndTimestamp - Date.now()) / 1000));
    if (restTimeRemaining === null) {
      setInitialRestTime(timeRemaining);
    }
    
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((restEndTimestamp - Date.now()) / 1000));
      setRestTimeRemaining(remaining);
      
      const currentInitial = restTimeRemaining === null ? timeRemaining : initialRestTime;
      const progress = currentInitial > 0 ? remaining / currentInitial : 0;
      progressValue.value = withTiming(progress, { duration: 1000 });

      if (remaining <= 0) {
        skipRest();
      }
    };
    
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, restEndTimestamp, skipRest]);

  const animatedCircleProps = useAnimatedStyle(() => {
    return {
      strokeDashoffset: CIRCLE_CIRCUMFERENCE * (1 - progressValue.value)
    } as any;
  });

  const handleAbort = () => {
    Alert.alert(
      'End Workout',
      'Are you sure you want to end this workout? Progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Workout', 
          style: 'destructive',
          onPress: () => {
            abortWorkout();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleCompleteSet = () => {
    const reps = currentReps ? parseInt(currentReps, 10) : undefined;
    const weight = currentWeight ? parseInt(currentWeight, 10) : undefined;
    completeSet(reps, weight);
    setCurrentReps('');
    setCurrentWeight('');
  };

  if (!plan) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>No active workout found.</Text>
        <Button label="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    );
  }

  if (state === 'syncing' || state === 'completing') {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#43E6D0" />
        <Text style={styles.loadingText}>Saving Progress...</Text>
      </View>
    );
  }

  const exercise = getCurrentExercise();
  if (!exercise) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAbort} style={styles.iconButton}>
          <X color="#F7F5FF" size={24} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>EXERCISE {currentExerciseIndex + 1} OF {plan.exercises.length}</Text>
          <View style={styles.progressDotsContainer}>
             {plan.exercises.map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.progressDot,
                    idx < currentExerciseIndex ? styles.progressDotCompleted :
                    idx === currentExerciseIndex ? styles.progressDotCurrent :
                    styles.progressDotPending
                  ]} 
                />
             ))}
          </View>
        </View>

        <TouchableOpacity 
          onPress={state === 'paused' ? resumeWorkout : pauseWorkout} 
          style={styles.iconButton}
        >
          {state === 'paused' ? <Play color="#43E6D0" size={24} fill="#43E6D0" /> : <Pause color="#F7F5FF" size={24} fill="#F7F5FF" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Exercise Media (Large, clear) */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.mediaContainer}>
           <Text style={styles.mediaPlaceholderText}>{currentExerciseIndex + 1}</Text>
           <TouchableOpacity style={styles.instructionsButton}>
              <Info color="#F7F5FF" size={16} />
              <Text style={styles.instructionsText}>INSTRUCTIONS</Text>
           </TouchableOpacity>
        </Animated.View>

        {/* Exercise Title and Meta */}
        <Animated.View entering={FadeIn.duration(400).delay(100)} style={styles.exerciseInfoContainer}>
          <Text style={styles.exerciseName}>{exercise.name.toUpperCase()}</Text>
          <View style={styles.exerciseMetaRow}>
             <Text style={styles.exerciseMuscle}>{exercise.muscleGroup || 'FULL BODY'}</Text>
             <View style={styles.dot} />
             <Text style={styles.exerciseEquipment}>{exercise.equipment || 'BODYWEIGHT'}</Text>
          </View>
        </Animated.View>

        {/* Dynamic Content based on State */}
        {state === 'resting' && restTimeRemaining !== null ? (
          <Animated.View entering={ZoomIn.duration(400)} exiting={ZoomOut.duration(300)} style={styles.restContainer}>
            <View style={styles.restRingContainer}>
              <Svg width={CIRCLE_RADIUS * 2 + 20} height={CIRCLE_RADIUS * 2 + 20} viewBox={`0 0 ${CIRCLE_RADIUS * 2 + 20} ${CIRCLE_RADIUS * 2 + 20}`}>
                <Circle
                  cx={CIRCLE_RADIUS + 10}
                  cy={CIRCLE_RADIUS + 10}
                  r={CIRCLE_RADIUS}
                  stroke="rgba(67, 230, 208, 0.1)"
                  strokeWidth={10}
                  fill="none"
                />
                <AnimatedCircle
                  cx={CIRCLE_RADIUS + 10}
                  cy={CIRCLE_RADIUS + 10}
                  r={CIRCLE_RADIUS}
                  stroke="#43E6D0"
                  strokeWidth={10}
                  fill="none"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  animatedProps={animatedCircleProps as any}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${CIRCLE_RADIUS + 10} ${CIRCLE_RADIUS + 10})`}
                />
              </Svg>
              <View style={styles.restTextContainer}>
                <Text style={styles.restLabel}>REST</Text>
                <Text style={styles.restTimerText}>{restTimeRemaining}</Text>
              </View>
            </View>
            
            <View style={styles.restActionsRow}>
              <Button label="+15S" onPress={() => { /* Store logic */ }} variant="secondary" style={styles.flex1} />
              <View style={{ width: 16 }} />
              <Button label="SKIP REST" onPress={skipRest} variant="primary" style={styles.flex1} />
            </View>
          </Animated.View>
        ) : state === 'paused' ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.pausedContainer}>
            <Pause color="#AAA7BA" size={48} />
            <Text style={styles.pausedTitle}>WORKOUT PAUSED</Text>
            <Button label="RESUME WORKOUT" onPress={resumeWorkout} variant="primary" fullWidth style={{ marginTop: 24 }} />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(400).delay(200)} style={styles.setContainer}>
             <View style={styles.setRowHeader}>
                <Text style={styles.setLabel}>SET {currentSetIndex + 1} OF {exercise.targetSets}</Text>
                <Text style={styles.setTargetLabel}>{exercise.targetReps ? `${exercise.targetReps} REPS` : `${exercise.targetDurationSeconds}S`}</Text>
             </View>

             <View style={styles.inputsRow}>
                <View style={styles.inputCard}>
                   <Text style={styles.inputLabel}>WEIGHT (KG)</Text>
                   <TextInput 
                     style={styles.inputField}
                     keyboardType="numeric"
                     value={currentWeight}
                     onChangeText={setCurrentWeight}
                     placeholder="-"
                     placeholderTextColor="#696678"
                   />
                </View>
                <View style={styles.inputCard}>
                   <Text style={styles.inputLabel}>REPS</Text>
                   <TextInput 
                     style={styles.inputField}
                     keyboardType="numeric"
                     value={currentReps}
                     onChangeText={setCurrentReps}
                     placeholder={exercise.targetReps ? exercise.targetReps.toString() : "-"}
                     placeholderTextColor="#696678"
                   />
                </View>
             </View>

             <Button 
               label="COMPLETE SET" 
               onPress={handleCompleteSet} 
               variant="primary" 
               size="lg" 
               leftIcon={<Check color="#0B0B13" size={24} strokeWidth={3} />} 
               fullWidth
             />
          </Animated.View>
        )}
      </ScrollView>

      {/* Next Exercise Preview */}
      {state === 'resting' && currentExerciseIndex + 1 < plan.exercises.length && (
         <Animated.View entering={FadeInDown.duration(400)} style={styles.nextExercisePreview}>
            <View>
              <Text style={styles.nextExerciseLabel}>UP NEXT</Text>
              <Text style={styles.nextExerciseName}>{plan.exercises[currentExerciseIndex + 1].name.toUpperCase()}</Text>
            </View>
            <Text style={styles.nextExerciseTarget}>{plan.exercises[currentExerciseIndex + 1].targetSets} SETS</Text>
         </Animated.View>
      )}
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B13', // No decorative particles while working out
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#0B0B13',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 24,
  },
  loadingText: {
    color: '#43E6D0',
    marginTop: 16,
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  progressDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  progressDot: {
    height: 4,
    width: 16,
    borderRadius: 2,
  },
  progressDotCompleted: {
    backgroundColor: '#43E6D0',
  },
  progressDotCurrent: {
    backgroundColor: '#665CFF',
  },
  progressDotPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 160,
  },
  mediaContainer: {
    height: 280,
    backgroundColor: '#10101A',
    borderRadius: 32,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(102, 92, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mediaPlaceholderText: {
    color: 'rgba(255, 255, 255, 0.05)',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 120,
  },
  instructionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(11, 11, 19, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionsText: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
  },
  exerciseInfoContainer: {
    marginBottom: 32,
  },
  exerciseName: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 32,
    lineHeight: 36,
    marginBottom: 8,
    letterSpacing: -1,
  },
  exerciseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseMuscle: {
    color: '#665CFF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  exerciseEquipment: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#696678',
  },
  setContainer: {
    backgroundColor: 'rgba(27, 27, 42, 0.6)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(102, 92, 255, 0.2)',
  },
  setRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  setLabel: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 18,
  },
  setTargetLabel: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 14,
  },
  inputsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  inputCard: {
    flex: 1,
    backgroundColor: '#10101A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    alignItems: 'center',
  },
  inputLabel: {
    color: '#696678',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputField: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 40,
    height: 50,
    textAlign: 'center',
  },
  restContainer: {
    alignItems: 'center',
  },
  restRingContainer: {
    width: CIRCLE_RADIUS * 2 + 20,
    height: CIRCLE_RADIUS * 2 + 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 32,
  },
  restTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restLabel: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: -4,
  },
  restTimerText: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 72,
    letterSpacing: -2,
    lineHeight: 80,
  },
  restActionsRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16,
  },
  flex1: {
    flex: 1,
  },
  pausedContainer: {
    backgroundColor: '#10101A',
    borderRadius: 32,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  pausedTitle: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 20,
    marginTop: 16,
    letterSpacing: 1,
  },
  nextExercisePreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(27, 27, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 92, 255, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextExerciseLabel: {
    color: '#AAA7BA',
    fontFamily: 'System',
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  nextExerciseName: {
    color: '#F7F5FF',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 16,
  },
  nextExerciseTarget: {
    color: '#43E6D0',
    fontFamily: 'System',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  }
});
