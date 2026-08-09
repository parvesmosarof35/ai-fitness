import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useController, UseControllerProps } from 'react-hook-form';

interface InputProps extends TextInputProps {
  label: string;
  name: string;
  control: any;
  rules?: any;
  defaultValue?: any;
}

export function Input({ name, control, rules, defaultValue, label, ...inputProps }: InputProps) {
  const { field, fieldState } = useController({ name, control, rules, defaultValue });

  return (
    <View className="mb-4">
      <Text className="text-zinc-300 font-semibold mb-2">{label}</Text>
      <TextInput
        className={`bg-zinc-800 text-white px-4 py-3 rounded-xl border ${fieldState.error ? 'border-red-500' : 'border-zinc-700 focus:border-emerald-400'}`}
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        placeholderTextColor="#71717a"
        {...inputProps}
      />
      {fieldState.error && (
        <Text className="text-red-500 text-sm mt-1">{fieldState.error.message}</Text>
      )}
    </View>
  );
}
