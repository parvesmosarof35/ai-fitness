import React from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { useController } from 'react-hook-form';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label: string;
  name: string;
  control: any;
  rules?: any;
  defaultValue?: any;
  iconName?: 'mail' | 'lock' | 'user' | 'eye' | 'shield';
  isPassword?: boolean;
}

const ICON_MAP = {
  mail: Mail,
  lock: Lock,
  user: User,
  eye: Eye,
  shield: ShieldCheck
};

export function Input({ name, control, rules, defaultValue, label, iconName, isPassword, ...inputProps }: InputProps) {
  const { field, fieldState } = useController({ name, control, rules, defaultValue });
  const [showPassword, setShowPassword] = React.useState(false);

  const IconComponent = iconName ? ICON_MAP[iconName] : null;
  const isSecureText = isPassword && !showPassword;

  return (
    <View className="mb-5">
      <Text className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2 ml-4">{label}</Text>
      <View className={`flex-row items-center bg-[#1b1b24] px-5 py-4 rounded-full border ${fieldState.error ? 'border-red-500' : 'border-white/5 focus:border-primary/50'}`}>
        {IconComponent && (
          <IconComponent color="#a1a1aa" size={20} className="mr-3" />
        )}
        <TextInput
          className="flex-1 text-white text-base font-medium"
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          placeholderTextColor="#52525b"
          secureTextEntry={isSecureText}
          {...inputProps}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-3">
            {showPassword ? <EyeOff color="#a1a1aa" size={20} /> : <Eye color="#a1a1aa" size={20} />}
          </TouchableOpacity>
        )}
      </View>
      {fieldState.error && (
        <Text className="text-red-500 text-xs mt-2 ml-4">{fieldState.error.message}</Text>
      )}
    </View>
  );
}
