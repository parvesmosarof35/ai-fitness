import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Search, Bell, Sparkles, Flame, Zap, Scale, Droplet, Utensils, ArrowRight, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BrandGradient } from '../../components/ui/BrandGradient';

type Props = { navigation: any };

const HERO_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDMQ2gyy8i--nNylcF0C0QNoVbdtCOQSDFP1gGY-b1_B1d1BOnoHhzNQ8KVKdji8Yg5p8_MRjwcCewTDnj7Yf3pMnix6R2gIQNYXPPxmM6CtnyyWBBsjl_i7JDmbGel3pjErkAiYHLsiGgEeXhRHl3IfjNVodRZbkTMM1ArGv6UuBhXIzU395HHMvU31MUx8hha_WxmaLlFkG6Ldngks0BWpuNzgLkJrRmAidSlZJXyHyMPaBXH5C__";
const PROFILE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpzRq8eWqGhw_DLOWqLck5bfKLPPJXOSbYuUDkWmVHysDySmSZE5f_7yu7BUOdg5meGjrUq-AiPVw6TPCOO2zYclzCXcD4gpIZY2mS1PYpbrqIZYOre4R0sKmYacTEtsaAunOpJGmWRLOBZVngAgYUcvxQpik7mEcCTeBVFOeisieq9P6dL-3kdSAqr35ArVrMBbA-updOXRHqzkXiiillGPlUSzGh8q1J5iw6BZvO7h5oLhTyUCMG";

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuthStore();
  const userName = user?.email ? user.email.split('@')[0] : "Champion"; 
  const { plans, loading } = useWorkouts();
  const { state, resumeWorkout, plan: activePlan } = useActiveWorkoutStore();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayPlan = plans[0];

  return (
    <View className="flex-1 bg-[#13121c]">
      {/* Background Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(108,92,255,0.15)', filter: 'blur(100px)' }} />
        <View style={{ position: 'absolute', bottom: 100, right: -50, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(0,205,168,0.15)', filter: 'blur(100px)' }} />
      </View>

      {/* Top App Bar */}
      <View style={{ paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(19,18,28,0.8)', zIndex: 50 }}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          onPress={() => navigation.navigate('AICoachChat')}
        >
          <Sparkles color="#44eac3" size={28} />
          <Text style={{ color: '#44eac3', fontSize: 24, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 }}>AURA</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity activeOpacity={0.7}>
            <Search color="#c8c4d8" size={24} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <View>
              <Bell color="#c8c4d8" size={24} />
              <View style={{ position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#44eac3' }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Profile')}>
            <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(68,234,195,0.3)' }}>
              <Image source={{ uri: PROFILE_IMG }} style={{ width: '100%', height: '100%' }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24, paddingTop: 24 }}>
        
        {/* Greeting Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="mb-10">
          <Text style={{ color: '#918ea1', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>
            {getGreeting()}, {userName} 👋
          </Text>
          <View>
            <Text style={{ fontSize: 48, fontWeight: '900', fontStyle: 'italic', color: '#6c5cff', lineHeight: 48, letterSpacing: -1.76 }}>TRAIN</Text>
            <Text style={{ fontSize: 48, fontWeight: '900', fontStyle: 'italic', color: '#ffb68c', lineHeight: 48, letterSpacing: -1.76 }}>TODAY</Text>
          </View>
        </Animated.View>

        {/* AI Workout Hero */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-10">
          <View style={{ borderRadius: 32, overflow: 'hidden', minHeight: 360, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
            <ImageBackground source={{ uri: HERO_IMG }} style={{ ...StyleSheet.absoluteFillObject, opacity: 0.6 }} imageStyle={{ resizeMode: 'cover' }} />
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(19,18,28,0.5)' }} />
            
            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 24 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>INTERMEDIATE</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>420 KCAL</Text>
                </View>
              </View>

              <Text style={{ color: '#918ea1', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>TODAY'S AI WORKOUT</Text>
              <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 32, marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                UPPER BODY{'\n'}STRENGTH
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <Clock color="#c8c4d8" size={16} />
                <Text style={{ color: '#c8c4d8', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>45 MIN SESSION</Text>
              </View>

              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => todayPlan ? navigation.navigate('Workouts', { screen: 'WorkoutOverview', params: { workoutId: todayPlan.id }}) : Alert.alert('Coming Soon', 'Generating workout...')}
              >
                <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999, shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 }}>
                  <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {state === 'active' || state === 'resting' ? 'RESUME WORKOUT' : 'START WORKOUT'}
                    </Text>
                    <ArrowRight color="#ffffff" size={18} />
                  </View>
                </BrandGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="mb-10">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' }}>
            
            {/* Calories */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>CALORIES</Text>
                <Flame color="#44eac3" size={20} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.metricValue}>1,240</Text>
                <Text style={styles.metricSub}>KCAL BURNED</Text>
              </View>
            </View>

            {/* Streak */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>STREAK</Text>
                <Zap color="#918ea1" size={20} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricSub}>DAYS ACTIVE</Text>
              </View>
            </View>

            {/* Weight */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>WEIGHT</Text>
                <Scale color="#ffb68c" size={20} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.metricValue}>76.4</Text>
                <Text style={styles.metricSub}>KG CURRENT</Text>
              </View>
            </View>

            {/* Water */}
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricTitle}>WATER</Text>
                <Droplet color="#00cda8" size={20} />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.metricValue}>1.8</Text>
                <Text style={styles.metricSub}>LITERS TODAY</Text>
              </View>
            </View>

          </View>
        </Animated.View>

        {/* Nutrition Summary */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} className="mb-10">
          <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700' }}>Today's Nutrition</Text>
              <Utensils color="#ffb68c" size={20} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 8, marginBottom: 24 }}>
              {[
                { label: 'CAL', color: '#6c5cff', height: '60%' },
                { label: 'PRO', color: '#44eac3', height: '80%' },
                { label: 'CARB', color: '#ffb68c', height: '40%' },
                { label: 'FAT', color: '#ffb4ab', height: '30%' },
              ].map(macro => (
                <View key={macro.label} style={{ alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#2a2933', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', height: macro.height, backgroundColor: macro.color }} />
                  </View>
                  <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{macro.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Meals')}
              style={{ width: '100%', paddingVertical: 12, borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '800', textTransform: 'uppercase' }}>VIEW NUTRITION</Text>
              <ArrowRight color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'col',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricTitle: {
    color: '#918ea1',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  metricSub: {
    color: '#918ea1',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 4,
  }
});
