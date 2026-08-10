import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Triangle } from 'lucide-react-native';

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
      const user = response.data.data.user;
      await signIn(response.data.data.accessToken, response.data.data.refreshToken, user);
    } catch (e: any) {
      alert(e.message || 'Registration failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* Header */}
        <SafeAreaView style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
          <View className="flex-row justify-between items-center px-6 py-4">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full bg-surface-highlight items-center justify-center"
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft color="#a1a1aa" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-black text-sm tracking-widest uppercase">FORGE AI</Text>
          </View>
        </SafeAreaView>

        <View className="px-8 pt-6 pb-12 flex-1">
          <View className="mb-8">
            <View className="flex-row items-center mb-2">
              <Text className="text-5xl font-black text-brand-orange leading-tight tracking-tight mr-2">JOIN</Text>
              <Triangle color="#34d399" fill="#34d399" size={32} />
            </View>
            <Text className="text-5xl font-black text-brand-cyan tracking-tight">TODAY</Text>
          </View>

          <View className="bg-surface-highlight/30 p-6 rounded-[32px] border border-white/5 mb-8">
            <Input
              name="email"
              control={control}
              label="Email"
              placeholder="alex@kinetic.ai"
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail"
            />

            <Input
              name="password"
              control={control}
              label="Password"
              placeholder="••••••••"
              isPassword
            />

            <Input
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              placeholder="••••••••"
              isPassword
              iconName="shield"
            />

            <View className="mt-4">
              <Button 
                label="Create Account" 
                onPress={handleSubmit(onSubmit)} 
                loading={isSubmitting} 
                variant="primary"
              />
            </View>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-white/10" />
              <Text className="text-zinc-600 px-4 text-xs font-bold uppercase">Or Continue With</Text>
              <View className="flex-1 h-px bg-white/10" />
            </View>

            <Button label="Continue with Google" variant="secondary" />
            <Button label="Continue with Apple" variant="secondary" />
          </View>

          <View className="flex-row justify-center mt-auto pb-4">
            <Text className="text-zinc-400">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-brand-cyan font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
