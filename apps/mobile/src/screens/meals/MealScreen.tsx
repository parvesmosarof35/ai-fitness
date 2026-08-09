import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, TouchableCard } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Utensils, Camera, Plus, Coffee, Apple } from 'lucide-react-native';

export default function MealScreen() {
  return (
    <ScrollView className="flex-1 bg-zinc-950" contentContainerStyle={{ paddingBottom: 100 }}>
      <View className="px-6 pt-16 pb-6 bg-zinc-900 border-b border-zinc-800 rounded-b-3xl">
        <Text className="text-3xl font-black text-white mb-6">Nutrition</Text>
        
        {/* Calories Ring / Summary */}
        <View className="items-center mb-8">
          <View className="w-48 h-48 rounded-full border-8 border-emerald-500/20 items-center justify-center relative">
            <View className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{ borderLeftColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-45deg' }] }} />
            <Text className="text-4xl font-black text-white">1,450</Text>
            <Text className="text-zinc-400 font-bold tracking-wider uppercase text-xs mt-1">kcal eaten</Text>
            <Text className="text-emerald-400 font-bold mt-2">550 remaining</Text>
          </View>
        </View>

        {/* Macros */}
        <View className="flex-row justify-between gap-4">
          <View className="flex-1">
            <View className="flex-row justify-between mb-1">
              <Text className="text-white font-bold text-xs uppercase">Carbs</Text>
              <Text className="text-zinc-400 text-xs">120/200g</Text>
            </View>
            <ProgressBar progress={60} colorClass="bg-blue-400" trackColorClass="bg-zinc-800" height={6} />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between mb-1">
              <Text className="text-white font-bold text-xs uppercase">Protein</Text>
              <Text className="text-zinc-400 text-xs">95/150g</Text>
            </View>
            <ProgressBar progress={63} colorClass="bg-purple-400" trackColorClass="bg-zinc-800" height={6} />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between mb-1">
              <Text className="text-white font-bold text-xs uppercase">Fat</Text>
              <Text className="text-zinc-400 text-xs">40/65g</Text>
            </View>
            <ProgressBar progress={61} colorClass="bg-orange-400" trackColorClass="bg-zinc-800" height={6} />
          </View>
        </View>
      </View>

      <View className="p-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white font-bold text-xl">Today's Meals</Text>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center">
            <Camera color="#34d399" size={20} />
          </TouchableOpacity>
        </View>

        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-orange-500/20 items-center justify-center mr-4">
              <Coffee color="#fb923c" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Breakfast</Text>
              <Text className="text-zinc-400 text-sm">Oatmeal & Protein Shake</Text>
            </View>
            <View className="items-end">
              <Text className="text-emerald-400 font-bold">450 kcal</Text>
              <Text className="text-zinc-500 text-xs">8:30 AM</Text>
            </View>
          </View>
        </Card>

        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-blue-500/20 items-center justify-center mr-4">
              <Utensils color="#60a5fa" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">Lunch</Text>
              <Text className="text-zinc-400 text-sm">Grilled Chicken Salad</Text>
            </View>
            <View className="items-end">
              <Text className="text-emerald-400 font-bold">650 kcal</Text>
              <Text className="text-zinc-500 text-xs">1:15 PM</Text>
            </View>
          </View>
        </Card>

        <TouchableCard className="border-dashed border-zinc-600 items-center justify-center py-6">
          <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-2">
            <Plus color="#a1a1aa" size={24} />
          </View>
          <Text className="text-white font-bold">Log a Meal</Text>
          <Text className="text-zinc-500 text-xs mt-1">Use AI to scan your food</Text>
        </TouchableCard>
      </View>
    </ScrollView>
  );
}
