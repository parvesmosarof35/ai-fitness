import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react-native';
import Animated, { FadeInDown, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';

type Props = { navigation: any };

const MEAL_1_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuCaVsse4HKXsR7rVKPWcZ3W5mOFbh9cSPSWZu5Cmn4rtQuUnTZD_GEPA-e4o5nd6ULkYTYEHYeeTQMYlPh64WWnII1InvoZnCBl6FF6XKTbU9iZyjLFjNofIfLJf3q2zOk-ppt4SNC23W-A7tJzQsJJXEZfeN2aqefpF4lXyrsW4QBsJJz9fI9jdd30Ja_MfqW6L9xEbj3-Zy5SseQreVgB4BWIli4prvA_EQSBNFDmodAgvQdX-F--";
const MEAL_2_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBZjGObWfkQefqXjSIlR4r3OXeRnvvtNM-gR5oqxhvFFsGjTKXNaOF76I7PzEj5xbZon0Br5xJe4ykHBk5wINFNEfsiGb7BxtAS-lYlJmSsTRZ4rwPNbI1VN02mbpF-yRGcVmIPwJ0mDA_92XuLRa_fwlgDatWzXxb0YdZPblKjtTcZhzFSf4kBx8PXk-3f1z_jh4wxmVpwuzzwci7RK7xmKBW_OYHvXmdynWHkoTcYpvL_qYDrmuBz";

export default function MealScreen({ navigation }: Props) {
  // SVG Setup for the circular progress
  const size = 120;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  
  // Hardcoded for UI demo
  const targetKcal = 2500;
  const consumedKcal = 1800;
  const progress = consumedKcal / targetKcal;

  return (
    <ForgeBackground>
      <ForgeHeader onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined} />

      <ScrollView contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 24, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        
        {/* Page Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', textTransform: 'uppercase', letterSpacing: -0.5 }}>DAILY FUEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#42E8CF', shadowColor: '#42E8CF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 4 }} />
            <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>NUTRITION TRACKING ACTIVE</Text>
          </View>
        </Animated.View>

        {/* Today's Macros Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={{ marginBottom: 24 }}>
          <GlassCard variant="hero" style={{ padding: 0 }} contentStyle={{ padding: 24 }}>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ color: '#F5F7FC', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 }}>TODAY'S MACROS</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#42E8CF', fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>DETAILS</Text>
                <ArrowRight color="#42E8CF" size={14} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', width: '100%' }}>
              {/* Circular Tracker */}
              <View style={{ width: size, height: size, marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle
                    cx={center} cy={center} r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={center} cy={center} r={radius}
                    stroke="#42E8CF"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                  />
                </Svg>
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', letterSpacing: -0.5 }}>1.8k</Text>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#6F7687', letterSpacing: 1, textTransform: 'uppercase' }}>KCAL</Text>
                </View>
              </View>

              {/* Macro Bars */}
              <View style={{ width: '100%', gap: 16 }}>
                <MacroBar label="PROTEIN" current={145} total={180} color="#7C6CFF" percentage={80} />
                <MacroBar label="CARBS" current={210} total={250} color="#42E8CF" percentage={84} />
                <MacroBar label="FAT" current={52} total={70} color="#FF9B6A" percentage={74} />
              </View>
            </View>

          </GlassCard>
        </Animated.View>

        {/* Today's Log */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ marginBottom: 16 }}>
          <Text style={{ color: '#F5F7FC', fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>TODAY'S LOG</Text>
          
          <MealItem 
            title="Pre-Workout Fuel"
            time="08:00 AM"
            kcal="650"
            macros={{ p: 45, c: 60, f: 20 }}
          />

          <MealItem 
            title="Recovery Lunch"
            time="13:30 PM"
            kcal="820"
            macros={{ p: 65, c: 80, f: 25 }}
          />

          {/* Add Meal Button */}
          <TouchableOpacity 
            activeOpacity={0.7}
            style={{ width: '100%', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(124, 108, 255, 0.4)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, backgroundColor: 'rgba(124, 108, 255, 0.05)' }}
          >
            <Plus color="#7C6CFF" size={18} strokeWidth={2.5} />
            <Text style={{ color: '#7C6CFF', fontSize: 13, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>LOG MEAL</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </ForgeBackground>
  );
}

// Subcomponents

function MacroBar({ label, current, total, color, percentage }: { label: string, current: number, total: number, color: string, percentage: number }) {
  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
        <Text style={{ color: '#F5F7FC', fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        <Text style={{ color: '#A7ADBC', fontSize: 11, fontWeight: '700' }}>
          <Text style={{ color: '#F5F7FC' }}>{current}g</Text> / {total}g
        </Text>
      </View>
      <View style={{ height: 8, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: color, borderRadius: 4 }} />
      </View>
    </View>
  );
}

function MealItem({ title, time, kcal, macros }: { title: string, time: string, kcal: string, macros: { p: number, c: number, f: number } }) {
  return (
    <GlassCard 
      style={{ marginBottom: 12 }}
      contentStyle={{ padding: 16 }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: '#F5F7FC', fontSize: 16, fontWeight: '800' }}>{title}</Text>
          <Text style={{ color: '#42E8CF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>{kcal} KCAL</Text>
        </View>
        <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12 }}>{time}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <MacroPill label="P" value={`${macros.p}g`} color="#7C6CFF" />
          <MacroPill label="C" value={`${macros.c}g`} color="#42E8CF" />
          <MacroPill label="F" value={`${macros.f}g`} color="#FF9B6A" />
        </View>
      </View>
    </GlassCard>
  );
}

function MacroPill({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: `${color}1F`, borderWidth: 1, borderColor: `${color}40`, flexDirection: 'row', gap: 4 }}>
      <Text style={{ color, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ color, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>{value}</Text>
    </View>
  );
}
