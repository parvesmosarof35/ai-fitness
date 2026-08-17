import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { useWorkouts } from '../../hooks/useWorkouts';
import { useActiveWorkoutStore } from '../../store/activeWorkoutStore';
import { Search, Bell, Sparkles, Flame, Zap, Scale, Droplet, Utensils, ArrowRight, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';

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
    <ForgeBackground>
      <ForgeHeader
        showProfile
        profileName={userName}
        showNotification
        rightAction={
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(124, 108, 255, 0.12)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(124, 108, 255, 0.3)' }}
            onPress={() => navigation.navigate('AICoachChat')}
          >
            <Sparkles color="#42E8CF" size={16} />
            <Text style={{ color: '#42E8CF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 }}>AURA COACH</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 24, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        
        {/* Greeting Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginBottom: 24 }}>
          <Text style={{ color: '#A7ADBC', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
            {getGreeting()}, {userName} 👋
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', letterSpacing: -0.5 }}>
            Daily Training Hub
          </Text>
        </Animated.View>

        {/* AI Workout Hero */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginBottom: 24 }}>
          <GlassCard variant="hero" style={{ padding: 0 }} contentStyle={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(124, 108, 255, 0.15)', borderWidth: 1, borderColor: 'rgba(124, 108, 255, 0.3)' }}>
                <Text style={{ color: '#7C6CFF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>INTERMEDIATE</Text>
              </View>
              <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(66, 232, 207, 0.15)', borderWidth: 1, borderColor: 'rgba(66, 232, 207, 0.3)' }}>
                <Text style={{ color: '#42E8CF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>420 KCAL</Text>
              </View>
            </View>

            <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
              TODAY'S WORKOUT PLAN
            </Text>
            <Text style={{ color: '#F5F7FC', fontSize: 24, fontWeight: '900', textTransform: 'uppercase', lineHeight: 28, marginBottom: 16 }}>
              UPPER BODY STRENGTH
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Clock color="#A7ADBC" size={16} />
              <Text style={{ color: '#A7ADBC', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>45 MIN SESSION</Text>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => todayPlan ? navigation.navigate('Workouts', { screen: 'WorkoutOverview', params: { workoutId: todayPlan.id }}) : Alert.alert('Coming Soon', 'Generating workout...')}
            >
              <BrandGradient colors={['#7C6CFF', '#42E8CF'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 16 }}>
                <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Text style={{ color: '#080A10', fontSize: 14, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {state === 'active' || state === 'resting' ? 'RESUME WORKOUT' : 'START WORKOUT'}
                  </Text>
                  <ArrowRight color="#080A10" size={18} />
                </View>
              </BrandGradient>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Metrics Grid */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' }}>
            
            {/* Calories */}
            <GlassCard style={{ width: '48%' }} contentStyle={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>CALORIES</Text>
                <Flame color="#42E8CF" size={18} />
              </View>
              <Text style={{ color: '#F5F7FC', fontSize: 24, fontWeight: '900' }}>1,240</Text>
              <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700', marginTop: 2 }}>KCAL BURNED</Text>
            </GlassCard>

            {/* Streak */}
            <GlassCard style={{ width: '48%' }} contentStyle={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>STREAK</Text>
                <Zap color="#7C6CFF" size={18} />
              </View>
              <Text style={{ color: '#F5F7FC', fontSize: 24, fontWeight: '900' }}>12</Text>
              <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700', marginTop: 2 }}>DAYS ACTIVE</Text>
            </GlassCard>

            {/* Weight */}
            <GlassCard style={{ width: '48%' }} contentStyle={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>WEIGHT</Text>
                <Scale color="#FF9B6A" size={18} />
              </View>
              <Text style={{ color: '#F5F7FC', fontSize: 24, fontWeight: '900' }}>76.4</Text>
              <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700', marginTop: 2 }}>KG CURRENT</Text>
            </GlassCard>

            {/* Water */}
            <GlassCard style={{ width: '48%' }} contentStyle={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>WATER</Text>
                <Droplet color="#42E8CF" size={18} />
              </View>
              <Text style={{ color: '#F5F7FC', fontSize: 24, fontWeight: '900' }}>1.8</Text>
              <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700', marginTop: 2 }}>LITERS TODAY</Text>
            </GlassCard>

          </View>
        </Animated.View>

        {/* Nutrition Summary */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)} style={{ marginBottom: 24 }}>
          <GlassCard contentStyle={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ color: '#F5F7FC', fontSize: 18, fontWeight: '800' }}>Today's Nutrition</Text>
              <Utensils color="#FF9B6A" size={20} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              {[
                { label: 'CAL', color: '#7C6CFF', height: '60%' as const },
                { label: 'PRO', color: '#42E8CF', height: '80%' as const },
                { label: 'CARB', color: '#FF9B6A', height: '40%' as const },
                { label: 'FAT', color: '#FF6B78', height: '30%' as const },
              ].map(macro => (
                <View key={macro.label} style={{ alignItems: 'center', gap: 6 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden', position: 'relative' }}>
                    <View style={{ position: 'absolute', bottom: 0, width: '100%', height: macro.height, backgroundColor: macro.color }} />
                  </View>
                  <Text style={{ color: '#6F7687', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>{macro.label}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Meals')}
              style={{ width: '100%', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
            >
              <Text style={{ color: '#F5F7FC', fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>VIEW NUTRITION</Text>
              <ArrowRight color="#F5F7FC" size={16} />
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

      </ScrollView>
    </ForgeBackground>
  );
}

const styles = StyleSheet.create({});
