import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { apiClient } from '../../services/api/client';
import { AuthStackParamList } from '../../navigation/types';
import { loginSchema, LoginPayload } from '../../schemas/profile';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const response = await apiClient.post('/auth/login', { email: data.email, password: data.password });
      // Determine if onboarding is complete (if the user has a profile)
      const hasOnboarding = response.data.data.user.profile !== null;
      await signIn(response.data.data.accessToken, response.data.data.refreshToken, hasOnboarding);
    } catch (e: any) {
      alert(e.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-zinc-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text className="text-4xl font-bold text-white mb-2">Welcome Back</Text>
        <Text className="text-zinc-400 mb-8">Sign in to continue your fitness journey.</Text>

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
          placeholder="Enter your password"
          secureTextEntry
        />

        <TouchableOpacity 
          className="self-end mb-8"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className="text-emerald-400 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>

        <Button 
          label="Log In" 
          onPress={handleSubmit(onSubmit)} 
          loading={isSubmitting} 
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-zinc-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-emerald-400 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
