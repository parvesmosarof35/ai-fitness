import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { StatBox } from '../../components/ui/StatBox';
import { Card, TouchableCard } from '../../components/ui/Card';
import { Flame, Timer, CheckCircle, Plus, Camera, Bot } from 'lucide-react-native';
import { BrandGradient } from '../../components/ui/BrandGradient';

export default function HomeScreen() {
  const { user } = useAuthStore();
  const userName = user?.email ? user.email.split('@')[0] : "Champion"; 

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-zinc-500 font-bold mb-1 tracking-[0.2em] uppercase text-[10px]">Good Morning</Text>
            <Text className="text-3xl font-black text-white">{userName}</Text>
          </View>
          <View className="w-12 h-12 bg-surface-highlight rounded-full items-center justify-center border border-white/5">
            <Text className="text-brand-cyan font-black text-lg">
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Top Stats */}
        <View className="flex-row gap-3">
          <StatBox label="Calories" value="1,240" icon={Flame} colorClass="text-brand-orange" iconColor="#fb923c" />
          <StatBox label="Minutes" value="45" icon={Timer} colorClass="text-brand-cyan" iconColor="#22d3ee" />
          <StatBox label="Workouts" value="3" icon={CheckCircle} colorClass="text-brand-purple" iconColor="#a855f7" />
        </View>
      </View>

      <View className="px-6">
        
        {/* Today's Plan */}
        <Text className="text-white font-black text-lg mb-4 tracking-wider uppercase">Today's Plan</Text>
        <Card className="p-0 overflow-hidden mb-8 border-white/5 bg-surface-highlight/30">
          <View className="h-32 relative">
            <View className="absolute inset-0 bg-brand-purple/10" />
            <View className="absolute bottom-4 left-4">
              <Text className="text-brand-cyan font-bold mb-1 uppercase text-[10px] tracking-widest">AI Generated</Text>
              <Text className="text-white font-black text-2xl tracking-tight">Full Body Power</Text>
              <Text className="text-zinc-400 text-xs mt-1 font-medium">45 min • Intermediate</Text>
            </View>
          </View>
          <View className="p-5 flex-row justify-between items-center">
            <Text className="text-zinc-400 font-medium">7 Exercises scheduled</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <BrandGradient className="px-6 py-2.5 rounded-full">
                <Text className="text-zinc-950 font-black tracking-wider uppercase text-xs">Start</Text>
              </BrandGradient>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text className="text-white font-black text-lg mb-4 tracking-wider uppercase">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-4">
          
          <TouchableCard className="flex-1 min-w-[45%] items-center justify-center p-6 bg-surface-highlight/30 border-white/5" activeOpacity={0.7}>
            <View className="w-12 h-12 bg-brand-cyan/20 rounded-full items-center justify-center mb-3">
              <Bot color="#22d3ee" size={24} />
            </View>
            <Text className="text-white font-bold tracking-wide">Generate</Text>
            <Text className="text-zinc-500 text-xs mt-1 font-medium uppercase tracking-wider">New Plan</Text>
          </TouchableCard>
          
          <TouchableCard className="flex-1 min-w-[45%] items-center justify-center p-6 bg-surface-highlight/30 border-white/5" activeOpacity={0.7}>
            <View className="w-12 h-12 bg-brand-purple/20 rounded-full items-center justify-center mb-3">
              <Camera color="#a855f7" size={24} />
            </View>
            <Text className="text-white font-bold tracking-wide">Track Form</Text>
            <Text className="text-zinc-500 text-xs mt-1 font-medium uppercase tracking-wider">AI Coach</Text>
          </TouchableCard>

        </View>

      </View>
    </ScrollView>
  );
}
