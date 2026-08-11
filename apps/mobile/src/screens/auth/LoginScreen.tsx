import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Sparkles, Mail, Lock, EyeOff, Globe, Download } from 'lucide-react-native';

import * as Crypto from 'expo-crypto';
import { AuthStackParamList } from '../../navigation/types';
import { loginSchema, LoginPayload } from '../../schemas/profile';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/forms/Input';
import { BrandGradient } from '../../components/ui/BrandGradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = {
        id: Crypto.randomUUID(),
        email: data.email,
        hasCompletedOnboarding: false,
      };
      await signIn(user);
    } catch (e: any) {
      alert(e.message || 'Login failed');
    }
  };

  return (
    <View className="flex-1 bg-[#13121c]">
      {/* Background Decor */}
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' as any }]}>
        <View style={{ position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500, borderRadius: 250, backgroundColor: 'rgba(108,92,255,0.15)', transform: [{ scale: 1.5 }] }} />
        <View style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, borderRadius: 300, backgroundColor: 'rgba(68,234,195,0.1)', transform: [{ scale: 1.5 }] }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} bounces={false} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 40) + 20 : 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} pointerEvents="box-none">
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft color="#918ea1" size={20} />
            </TouchableOpacity>
            <Text style={{ color: '#c5c0ff', fontSize: 28, fontWeight: '900', letterSpacing: -0.8 }} className="uppercase text-center">FORGE AI</Text>
            <View style={{ width: 40 }} />
          </View>

          <View className="flex-1 justify-center px-6 pt-[120px] w-full max-w-md mx-auto">
            {/* Title Section */}
            <View className="mb-8 relative items-center">
              <View className="absolute -top-4 -left-2 opacity-50">
                <Sparkles color="#6c5cff" size={24} />
              </View>
              <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: '#6c5cff' }}>WELCOME</Text>
              <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: '#44eac3' }}>BACK</Text>
            </View>

            {/* Glass Form Card */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }} className="shadow-2xl">
              <View className="mb-4">
                <Input
                  name="email"
                  control={control}
                  label="Email Address"
                  placeholder="runner@kinetic.ai"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  iconName="mail"
                />
              </View>

              <View className="mb-2 relative">
                <Input
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                />
              </View>

              <View className="items-end mb-6">
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as any)}>
                  <Text style={{ color: '#b45f24', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' }}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginBottom: 24 }}>
                <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999 }}>
                  <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#13121c', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                      {isSubmitting ? 'Verifying...' : 'Login'}
                    </Text>
                  </View>
                </BrandGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center mb-6 opacity-60">
                <View className="flex-1 h-[1px] bg-white/20" />
                <Text style={{ color: '#918ea1', fontSize: 12, fontWeight: '700', marginHorizontal: 16 }}>OR</Text>
                <View className="flex-1 h-[1px] bg-white/20" />
              </View>

              {/* Social Logins */}
              <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 9999, paddingVertical: 14, marginBottom: 12 }}>
                <Globe color="#e5e0ee" size={20} style={{ marginRight: 12 }} />
                <Text style={{ color: '#e5e0ee', fontSize: 14, fontWeight: '800' }}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 9999, paddingVertical: 14 }}>
                <Download color="#e5e0ee" size={20} style={{ marginRight: 12 }} />
                <Text style={{ color: '#e5e0ee', fontSize: 14, fontWeight: '800' }}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <Text style={{ color: '#c8c4d8', fontSize: 16 }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register' as any)}>
                <Text style={{ color: '#44eac3', fontSize: 16, fontWeight: '700' }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
