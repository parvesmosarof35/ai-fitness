import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { apiClient } from '../../services/api/client';

import { AuthStackParamList } from '../../navigation/types';
import { registerSchema, RegisterPayload } from '../../schemas/profile';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      const response = await apiClient.post('/auth/register', { 
        email: data.email, 
        password: data.password, 
      });
      await signIn(response.data.data.accessToken, response.data.data.refreshToken, false);
    } catch (e: any) {
      alert(e.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-zinc-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text className="text-4xl font-bold text-white mb-2">Create Account</Text>
        <Text className="text-zinc-400 mb-8">Start your fitness journey today.</Text>

        <Input
          name="email"
          control={control}
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          name="password"
          control={control}
          label="Password"
          placeholder="Create a password"
          secureTextEntry
        />

        <Input
          name="confirmPassword"
          control={control}
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
        />

        <View className="mt-8">
          <Button 
            label="Sign Up" 
            onPress={handleSubmit(onSubmit)} 
            loading={isSubmitting} 
          />
        </View>

        <View className="flex-row justify-center mt-6">
          <Text className="text-zinc-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-emerald-400 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
