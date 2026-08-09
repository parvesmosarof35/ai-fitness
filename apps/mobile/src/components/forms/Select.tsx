import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useController, UseControllerProps } from 'react-hook-form';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  name: string;
  control: any;
  rules?: any;
  defaultValue?: any;
}

export function Select({ name, control, rules, defaultValue, label, options }: SelectProps) {
  const { field, fieldState } = useController({ name, control, rules, defaultValue });

  return (
    <View className="mb-4">
      <Text className="text-zinc-300 font-semibold mb-2">{label}</Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {options.map((option) => {
          const isSelected = field.value === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => field.onChange(option.value)}
              className={`px-4 py-3 rounded-xl border ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-800 border-zinc-700'}`}
            >
              <Text className={`${isSelected ? 'text-zinc-900 font-bold' : 'text-zinc-300'}`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {fieldState.error && (
        <Text className="text-red-500 text-sm mt-1">{fieldState.error.message}</Text>
      )}
    </View>
  );
}
