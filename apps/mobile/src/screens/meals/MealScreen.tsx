import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Platform, ImageBackground } from 'react-native';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react-native';
import Animated, { FadeInDown, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

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
    <View className="flex-1 bg-[#0F1015]">
      {/* Background Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: '-10%', left: '-20%', width: '70%', aspectRatio: 1, borderRadius: 9999, backgroundColor: 'rgba(108,92,255,0.1)', filter: 'blur(100px)' }} />
        <View style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '60%', aspectRatio: 1, borderRadius: 9999, backgroundColor: 'rgba(68,234,195,0.1)', filter: 'blur(100px)' }} />
      </View>

      {/* Top App Bar */}
      <View style={{ paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(15,16,21,0.5)', zIndex: 50 }}>
        {navigation.canGoBack() ? (
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#6c5cff" size={24} />
          </TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
        
        <Text style={{ color: '#e5e0ee', fontSize: 16, fontWeight: '900', letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>AURA</Text>
        
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 24, paddingTop: 16 }}>
        
        {/* Page Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)} className="mb-10">
          <Text style={{ fontSize: 32, fontWeight: '900', color: '#e5e0ee', textTransform: 'uppercase', letterSpacing: -1 }}>DAILY FUEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#44eac3', shadowColor: '#44eac3', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 4 }} />
            <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>LIVE TRACKING ACTIVE</Text>
          </View>
        </Animated.View>

        {/* Today's Macros Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)} className="mb-10">
          <View style={{ backgroundColor: 'rgba(32,34,42,0.4)', borderRadius: 32, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <Text style={{ color: '#e5e0ee', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>TODAY'S MACROS</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#44eac3', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>DETAILS</Text>
                <ArrowRight color="#44eac3" size={14} />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center', width: '100%' }}>
              {/* Circular Tracker */}
              <View style={{ width: size, height: size, marginBottom: 32, justifyContent: 'center', alignItems: 'center' }}>
                <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle
                    cx={center} cy={center} r={radius}
                    stroke="#2C2E36"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <Circle
                    cx={center} cy={center} r={radius}
                    stroke="#44eac3"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round"
                  />
                </Svg>
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                  <Text style={{ fontSize: 36, fontWeight: '900', color: '#e5e0ee', letterSpacing: -1 }}>1.8k</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#918ea1', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>KCAL</Text>
                </View>
              </View>

              {/* Macro Bars */}
              <View style={{ width: '100%', gap: 24 }}>
                <MacroBar label="PROTEIN" current={145} total={180} color="#6c5cff" percentage={80} />
                <MacroBar label="CARBS" current={210} total={250} color="#44eac3" percentage={84} />
                <MacroBar label="FAT" current={52} total={70} color="#ffb68c" percentage={74} />
              </View>
            </View>

          </View>
        </Animated.View>

        {/* Today's Log */}
        <Animated.View entering={FadeInDown.duration(400).delay(300)} className="mb-4">
          <Text style={{ color: '#e5e0ee', fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>TODAY'S LOG</Text>
          
          <MealItem 
            title="Pre-Workout Fuel"
            time="08:00 AM"
            kcal="650"
            imgUri={MEAL_1_IMG}
            macros={{ p: 45, c: 60, f: 20 }}
          />

          <MealItem 
            title="Recovery Lunch"
            time="13:30 PM"
            kcal="820"
            imgUri={MEAL_2_IMG}
            macros={{ p: 65, c: 80, f: 25 }}
          />

          {/* Add Meal Button */}
          <TouchableOpacity 
            activeOpacity={0.7}
            style={{ width: '100%', paddingVertical: 16, borderRadius: 9999, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(108,92,255,0.3)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}
          >
            <Plus color="#6c5cff" size={20} strokeWidth={3} />
            <Text style={{ color: '#6c5cff', fontSize: 14, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' }}>LOG MEAL</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// Subcomponents

function MacroBar({ label, current, total, color, percentage }: { label: string, current: number, total: number, color: string, percentage: number }) {
  return (
    <View style={{ width: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
        <Text style={{ color: '#e5e0ee', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{label}</Text>
        <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>
          <Text style={{ color: '#e5e0ee' }}>{current}g</Text> / {total}g
        </Text>
      </View>
      <View style={{ height: 10, width: '100%', backgroundColor: '#2C2E36', borderRadius: 5, overflow: 'hidden' }}>
        <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: color, borderRadius: 5 }} />
      </View>
    </View>
  );
}

function MealItem({ title, time, kcal, imgUri, macros }: { title: string, time: string, kcal: string, imgUri: string, macros: { p: number, c: number, f: number } }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={{ backgroundColor: 'rgba(32,34,42,0.4)', borderRadius: 32, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <View style={{ width: 64, height: 64, borderRadius: 32, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)' }}>
        <Image source={{ uri: imgUri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ color: '#e5e0ee', fontSize: 16, fontWeight: '700' }}>{title}</Text>
          <Text style={{ color: '#44eac3', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{kcal} KCAL</Text>
        </View>
        <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 12 }}>{time}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <MacroPill label="P" value={`${macros.p}g`} color="#6c5cff" />
          <MacroPill label="C" value={`${macros.c}g`} color="#44eac3" />
          <MacroPill label="F" value={`${macros.f}g`} color="#ffb68c" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MacroPill({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999, backgroundColor: `${color}1A`, borderWidth: 1, borderColor: `${color}33`, flexDirection: 'row', gap: 4 }}>
      <Text style={{ color, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{label}</Text>
      <Text style={{ color, fontSize: 9, fontWeight: '700', textTransform: 'uppercase', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>{value}</Text>
    </View>
  );
}
