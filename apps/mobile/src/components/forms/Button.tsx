import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ label, loading, variant = 'primary', ...props }: ButtonProps) {
  let bgClass = '';
  let textClass = '';
  let borderClass = '';

  switch (variant) {
    case 'primary':
      bgClass = 'bg-emerald-500';
      textClass = 'text-zinc-900';
      break;
    case 'secondary':
      bgClass = 'bg-zinc-800';
      textClass = 'text-white';
      break;
    case 'outline':
      bgClass = 'bg-transparent';
      textClass = 'text-emerald-400';
      borderClass = 'border-2 border-emerald-500';
      break;
  }

  const opacity = props.disabled || loading ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      className={`${bgClass} ${borderClass} ${opacity} px-6 py-4 rounded-full flex-row justify-center items-center mt-2`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#18181b' : '#34d399'} />
      ) : (
        <Text className={`${textClass} font-bold text-lg`}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
