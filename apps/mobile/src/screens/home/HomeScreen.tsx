import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/forms/Button';
import { Bot, Camera, Dumbbell, Play, Search, Utensils } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = { navigation: any };

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const userName = user?.email ? user.email.split('@')[0] : "Champion"; 
  const { plans, loading } = useWorkouts();
  const { state, resumeWorkout, plan: activePlan } = useActiveWorkoutStore();

  const todayPlan = plans[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  return (
    <ForgeBackground>
      <ForgeHeader 
        showProfile 
        profileName={userName}
        showNotification 
      />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Hero Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="px-6 mb-8 mt-2">
          <Text className="text-zinc-500 font-bold mb-2 tracking-[0.2em] uppercase text-xs">{getGreeting()}, {userName}</Text>
          <Text style={styles.heroLine1}>READY TO</Text>
          <Text style={styles.heroLine2}>TRAIN?</Text>
        </Animated.View>

        {/* Today's Workout Hero */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="px-6 mb-8">
          {state === 'active' || state === 'resting' || state === 'paused' ? (
            <GlassCard variant="selected" style={{ padding: 0 }}>
              <View className="p-6">
                <Text className="text-brand-cyan font-bold mb-2 uppercase text-[10px] tracking-widest">In Progress</Text>
                <Text className="text-white font-black text-3xl tracking-tight mb-6">{activePlan?.title}</Text>
                <Button 
                  label="Resume Workout" 
                  onPress={() => {
                    resumeWorkout();
                    navigation.navigate('Workout', { screen: 'ActiveSession' });
                  }} 
                  variant="primary"
                  leftIcon={<Play color="#0B0B13" size={18} fill="#0B0B13" />}
                />
              </View>
            </GlassCard>
          ) : loading ? (
            <GlassCard variant="elevated" style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
               <ActivityIndicator color="#43E6D0" />
               <Text className="text-zinc-500 mt-4 font-bold text-xs uppercase tracking-wider">Loading your plan...</Text>
            </GlassCard>
          ) : todayPlan ? (
            <GlassCard variant="hero" style={{ padding: 0 }}>
              <View className="h-48 relative bg-[#10101A] justify-center items-center">
                <Dumbbell color="#1B1B2A" size={64} />
                <View className="absolute inset-0 bg-brand-violet/20" />
                <View className="absolute bottom-6 left-6 right-6">
                  <Text className="text-brand-cyan font-bold mb-1 uppercase text-[10px] tracking-widest">
                    {todayPlan.generatedByAI ? 'AI Generated' : 'Today\'s Plan'}
                  </Text>
                  <Text className="text-white font-black text-3xl tracking-tight leading-none mb-2">{todayPlan.title}</Text>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{todayPlan.estimatedDurationMinutes} min</Text>
                    <View className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{todayPlan.difficulty}</Text>
                    <View className="w-1 h-1 bg-zinc-700 rounded-full" />
                    <Text className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{todayPlan.exercises.length} Exercises</Text>
                  </View>
                </View>
              </View>
              <View className="p-6">
                <Button 
                  label="Start Workout" 
                  onPress={() => navigation.navigate('Workout', { screen: 'WorkoutOverview', params: { workoutId: todayPlan.id }})} 
                  variant="primary"
                />
              </View>
            </GlassCard>
          ) : (
            <GlassCard variant="elevated" style={{ padding: 32, alignItems: 'center' }}>
               <Text className="text-white font-black text-xl mb-2">Build Your Plan</Text>
               <Text className="text-zinc-400 font-medium text-center mb-6 text-sm">
                 Generate a workout based on your goals, time and equipment.
               </Text>
               <Button 
                 label="Generate Plan" 
                 onPress={() => Alert.alert('Coming Soon', 'Generate is coming soon.')} 
                 variant="primary"
                 fullWidth
               />
            </GlassCard>
          )}
        </Animated.View>

        {/* Weekly Activity */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="px-6 mb-8">
          <View className="flex-row justify-between items-end mb-4">
            <Text className="text-white font-black text-lg uppercase tracking-wider">Weekly Activity</Text>
            <View className="bg-brand-violet/20 px-3 py-1 rounded-full border border-brand-violet/30">
              <Text className="text-brand-violetLight font-bold text-[10px] uppercase tracking-widest">3 Day Streak</Text>
            </View>
          </View>
          <GlassCard style={{ padding: 16 }}>
             <View className="flex-row justify-between items-center">
               {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                 // Mocking data logic for now: T, W completed. T is current.
                 const isCompleted = index === 1 || index === 2;
                 const isCurrent = index === 3;
                 
                 let circleStyle = styles.dayCircleMuted;
                 let textStyle = styles.dayTextMuted;
                 
                 if (isCompleted) {
                   circleStyle = styles.dayCircleCompleted;
                   textStyle = styles.dayTextCompleted;
                 } else if (isCurrent) {
                   circleStyle = styles.dayCircleCurrent;
                   textStyle = styles.dayTextCurrent;
                 }

                 return (
                   <View key={index} className="items-center">
                     <View style={[styles.dayCircle, circleStyle]}>
                       {isCompleted && <Text style={{ color: '#0B0B13', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
                     </View>
                     <Text style={[styles.dayText, textStyle]}>{day}</Text>
                   </View>
                 );
               })}
             </View>
          </GlassCard>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="px-6 mb-8">
          <Text className="text-white font-black text-lg mb-4 uppercase tracking-wider">Quick Actions</Text>
          <View className="flex-row flex-wrap gap-4">
            <TouchableOpacity 
              style={styles.quickAction} 
              activeOpacity={0.7} 
              onPress={() => Alert.alert('Coming Soon', 'This feature is coming soon!')}
            >
              <GlassCard style={{ padding: 20, alignItems: 'center' }}>
                <View style={styles.iconWrapperViolet}>
                  <Bot color="#9388FF" size={24} />
                </View>
                <Text style={styles.quickActionTitle}>Generate</Text>
                <Text style={styles.quickActionSubtitle}>New Plan</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAction} 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('Meals')}
            >
              <GlassCard style={{ padding: 20, alignItems: 'center' }}>
                <View style={styles.iconWrapperOrange}>
                  <Utensils color="#FF8A4C" size={24} />
                </View>
                <Text style={styles.quickActionTitle}>Scan</Text>
                <Text style={styles.quickActionSubtitle}>Meal Log</Text>
              </GlassCard>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction} 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('Workouts')}
            >
              <GlassCard style={{ padding: 20, alignItems: 'center' }}>
                <View style={styles.iconWrapperCyan}>
                  <Search color="#43E6D0" size={24} />
                </View>
                <Text style={styles.quickActionTitle}>Browse</Text>
                <Text style={styles.quickActionSubtitle}>Workouts</Text>
              </GlassCard>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickAction} 
              activeOpacity={0.7} 
              onPress={() => Alert.alert('Coming Soon', 'AI Coach tracking is coming soon!')}
            >
              <GlassCard style={{ padding: 20, alignItems: 'center' }}>
                <View style={styles.iconWrapperNeutral}>
                  <Camera color="#AAA7BA" size={24} />
                </View>
                <Text style={styles.quickActionTitle}>Track</Text>
                <Text style={styles.quickActionSubtitle}>AI Coach</Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({
  heroLine1: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 48,
    color: '#665CFF', // Violet
    letterSpacing: -1,
    lineHeight: 48,
  },
  heroLine2: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 48,
    color: '#43E6D0', // Cyan
    letterSpacing: -1,
    lineHeight: 48,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dayCircleCompleted: {
    backgroundColor: '#43E6D0',
  },
  dayCircleCurrent: {
    backgroundColor: 'rgba(102, 92, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#665CFF',
  },
  dayCircleMuted: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'System',
  },
  dayTextCompleted: {
    color: '#43E6D0',
  },
  dayTextCurrent: {
    color: '#665CFF',
  },
  dayTextMuted: {
    color: '#696678',
  },
  quickAction: {
    width: '47%',
  },
  quickActionTitle: {
    color: '#F7F5FF',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 12,
  },
  quickActionSubtitle: {
    color: '#AAA7BA',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  iconWrapperViolet: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(102, 92, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperOrange: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 138, 76, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperCyan: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(67, 230, 208, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperNeutral: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
