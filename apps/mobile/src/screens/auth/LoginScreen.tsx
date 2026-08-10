import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Sparkles, ArrowLeft } from 'lucide-react-native';

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
      const user = response.data.data.user;
      await signIn(response.data.data.accessToken, response.data.data.refreshToken, user);
    } catch (e: any) {
      alert(e.message || 'Login failed');
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
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-highlight items-center justify-center">
              <ArrowLeft color="#a1a1aa" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-black text-sm tracking-widest uppercase">FORGE AI</Text>
          </View>
        </SafeAreaView>

        <View className="px-8 pt-8 pb-12 flex-1">
          <View className="mb-10">
            <Sparkles color="#a855f7" size={24} className="mb-4" />
            <Text className="text-5xl font-black text-brand-purple leading-tight tracking-tight">WELCOME</Text>
            <Text className="text-5xl font-black text-brand-cyan tracking-tight">BACK</Text>
          </View>

          <View className="bg-surface-highlight/30 p-6 rounded-[32px] border border-white/5 mb-8">
            <Input
              name="email"
              control={control}
              label="Email Address"
              placeholder="runner@kinetic.ai"
              keyboardType="email-address"
              autoCapitalize="none"
              iconName="mail"
            />

            <View className="relative">
              <Input
                name="password"
                control={control}
                label="Password"
                placeholder="••••••••"
                isPassword
              />
              <TouchableOpacity 
                className="absolute right-0 -bottom-6"
                onPress={() => navigation.navigate('ForgotPassword' as any)}
              >
                <Text className="text-brand-orange text-xs font-bold uppercase tracking-wider">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8">
              <Button 
                label="Login" 
                onPress={handleSubmit(onSubmit)} 
                loading={isSubmitting} 
                variant="primary"
              />
            </View>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-white/10" />
              <Text className="text-zinc-600 px-4 text-xs font-bold">OR</Text>
              <View className="flex-1 h-px bg-white/10" />
            </View>

            <Button label="Continue with Google" variant="secondary" />
            <Button label="Continue with Apple" variant="secondary" />
          </View>

          <View className="flex-row justify-center mt-auto pb-4">
            <Text className="text-zinc-400">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-brand-cyan font-bold">Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
