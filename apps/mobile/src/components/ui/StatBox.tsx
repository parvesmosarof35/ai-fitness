import React from 'react';
import { View, Text } from 'react-native';
import { Card } from './Card';
import { LucideIcon } from 'lucide-react-native';

interface StatBoxProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatBox({ label, value, icon: Icon, iconColor = '#34d399' }: StatBoxProps) {
  return (
    <Card className="flex-1 flex-col justify-between p-4" style={{ minHeight: 110 }}>
      <View className="flex-row justify-between items-center mb-2">
        <View className="p-2 rounded-full bg-zinc-700/50">
          <Icon size={20} color={iconColor} strokeWidth={2.5} />
        </View>
      </View>
      <View>
        <Text className="text-2xl font-bold text-white tracking-tight">{value}</Text>
        <Text className="text-xs font-medium text-zinc-400 mt-1 uppercase tracking-wider">{label}</Text>
      </View>
    </Card>
  );
}
