import React from 'react';
import { View, TouchableOpacity, ViewProps, TouchableOpacityProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View 
      className={`bg-zinc-800 rounded-2xl border border-zinc-700/50 p-4 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

interface TouchableCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export function TouchableCard({ children, className = '', active = false, ...props }: TouchableCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={`rounded-2xl border p-4 ${
        active 
          ? 'bg-emerald-500/20 border-emerald-500' 
          : 'bg-zinc-800 border-zinc-700/50'
      } ${className}`}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}
