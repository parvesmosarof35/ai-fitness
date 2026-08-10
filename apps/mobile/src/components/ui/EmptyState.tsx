import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-16 h-16 bg-surface-highlight rounded-full items-center justify-center mb-4">
        <Icon size={32} color="#71717a" />
      </View>
      <Text className="text-xl font-bold text-white mb-2 text-center">{title}</Text>
      <Text className="text-muted-foreground text-center mb-6">{description}</Text>
      {action}
    </View>
  );
}
