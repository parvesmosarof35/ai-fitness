import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import { BrandGradient } from '../ui/BrandGradient';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
}

export function Button({ label, loading, variant = 'primary', ...props }: ButtonProps) {
  let bgClass = '';
  let textClass = '';
  let borderClass = '';

  switch (variant) {
    case 'secondary':
      bgClass = 'bg-surface-highlight';
      textClass = 'text-white';
      break;
    case 'outline':
      bgClass = 'bg-transparent';
      textClass = 'text-primary';
      borderClass = 'border-2 border-primary';
      break;
    case 'glass':
      bgClass = 'bg-white/5 border border-white/10';
      textClass = 'text-white';
      break;
    default:
      textClass = 'text-zinc-950'; // primary text is dark
  }

  const opacity = props.disabled || loading ? 'opacity-50' : 'opacity-100';
  const innerContent = (
    <View className="flex-row justify-center items-center">
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#18181b' : '#22d3ee'} />
      ) : (
        <Text className={`${textClass} font-black uppercase tracking-wider text-sm`}>{label}</Text>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        className={`${opacity} mt-2`}
        disabled={props.disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <BrandGradient className="px-6 py-4 rounded-full">
          {innerContent}
        </BrandGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${bgClass} ${borderClass} ${opacity} px-6 py-4 rounded-full flex-row justify-center items-center mt-2`}
      disabled={props.disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {innerContent}
    </TouchableOpacity>
  );
}
