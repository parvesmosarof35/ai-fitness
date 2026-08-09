import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  colorClass?: string;
  trackColorClass?: string;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  height = 8, 
  colorClass = 'bg-emerald-500',
  trackColorClass = 'bg-zinc-800',
  className = ''
}: ProgressBarProps) {
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${Math.min(Math.max(progress, 0), 100)}%`, { damping: 20, stiffness: 90 })
    };
  });

  return (
    <View className={`w-full overflow-hidden rounded-full ${trackColorClass} ${className}`} style={{ height }}>
      <Animated.View 
        className={`h-full rounded-full ${colorClass}`} 
        style={animatedStyle}
      />
    </View>
  );
}
