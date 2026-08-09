import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { StatBox } from '../../components/ui/StatBox';
import { Card, TouchableCard } from '../../components/ui/Card';
import { Flame, Timer, CheckCircle, Plus, Camera, Bot } from 'lucide-react-native';

export default function HomeScreen() {
  const { session } = useAuthStore();
  const userName = session?.profile?.language ? "Explorer" : "Champion"; // Using placeholder if no real name field exists yet

  return (
    <ScrollView className="flex-1 bg-zinc-950" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="px-6 pt-16 pb-6 bg-zinc-900 border-b border-zinc-800 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-zinc-400 font-medium mb-1 tracking-wider uppercase text-xs">Good Morning</Text>
            <Text className="text-3xl font-black text-white">{userName}</Text>
          </View>
          <View className="w-12 h-12 bg-emerald-500/20 rounded-full items-center justify-center border border-emerald-500/30">
            <Text className="text-emerald-400 font-bold text-lg">
              {userName.charAt(0)}
            </Text>
          </View>
        </View>

        {/* Top Stats */}
        <View className="flex-row gap-3">
          <StatBox label="Calories" value="1,240" icon={Flame} colorClass="text-orange-400" iconColor="#fb923c" />
          <StatBox label="Minutes" value="45" icon={Timer} colorClass="text-emerald-400" iconColor="#34d399" />
          <StatBox label="Workouts" value="3" icon={CheckCircle} colorClass="text-blue-400" iconColor="#60a5fa" />
        </View>
      </View>

      <View className="p-6">
        
        {/* Today's Plan */}
        <Text className="text-white font-bold text-xl mb-4">Today's Plan</Text>
        <Card className="p-0 overflow-hidden mb-8 border-emerald-500/30">
          <View className="h-32 bg-zinc-800 relative">
            {/* Background pattern placeholder */}
            <View className="absolute inset-0 bg-emerald-500/10" />
            <View className="absolute bottom-4 left-4">
              <Text className="text-emerald-400 font-bold mb-1 uppercase text-xs tracking-wider">AI Generated</Text>
              <Text className="text-white font-black text-2xl">Full Body Power</Text>
              <Text className="text-zinc-300">45 min • Intermediate</Text>
            </View>
          </View>
          <View className="p-4 bg-zinc-900 flex-row justify-between items-center">
            <Text className="text-zinc-400">7 Exercises scheduled</Text>
            <TouchableOpacity className="bg-emerald-500 px-6 py-2 rounded-full">
              <Text className="text-zinc-950 font-bold">Start</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text className="text-white font-bold text-xl mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-4">
          
          <TouchableCard className="flex-1 min-w-[45%] items-center justify-center p-6 bg-zinc-900 border-zinc-800">
            <View className="w-12 h-12 bg-blue-500/20 rounded-full items-center justify-center mb-3">
              <Bot color="#60a5fa" size={24} />
            </View>
            <Text className="text-white font-bold">Generate</Text>
            <Text className="text-zinc-500 text-xs mt-1">New Plan</Text>
          </TouchableCard>
          
          <TouchableCard className="flex-1 min-w-[45%] items-center justify-center p-6 bg-zinc-900 border-zinc-800">
            <View className="w-12 h-12 bg-purple-500/20 rounded-full items-center justify-center mb-3">
              <Camera color="#a855f7" size={24} />
            </View>
            <Text className="text-white font-bold">Track Form</Text>
            <Text className="text-zinc-500 text-xs mt-1">AI Coach</Text>
          </TouchableCard>

        </View>

      </View>
    </ScrollView>
  );
}
