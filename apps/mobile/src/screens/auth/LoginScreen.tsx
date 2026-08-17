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
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';

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
    <ForgeBackground>
      <ForgeHeader onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24, justifyContent: 'center' }} bounces={false} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', maxWidth: 420, alignSelf: 'center' }}>
            
            {/* Title Section */}
            <View style={{ marginBottom: 32, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles color="#7C6CFF" size={20} />
                <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: 2, color: '#7C6CFF', textTransform: 'uppercase' }}>FORGE AI AUTH</Text>
              </View>
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', textAlign: 'center', letterSpacing: -0.5 }}>Welcome Back</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#A7ADBC', textAlign: 'center', marginTop: 6 }}>Sign in to continue your training journey</Text>
            </View>

            {/* Glass Form Card */}
            <GlassCard variant="hero" style={{ padding: 0 }} contentStyle={{ padding: 24 }}>
              <View style={{ marginBottom: 16 }}>
                <Input
                  name="email"
                  control={control}
                  label="Email Address"
                  placeholder="athlete@forgeai.app"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  iconName="mail"
                />
              </View>

              <View style={{ marginBottom: 8 }}>
                <Input
                  name="password"
                  control={control}
                  label="Password"
                  placeholder="••••••••"
                  isPassword
                />
              </View>

              <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as any)}>
                  <Text style={{ color: '#42E8CF', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 }}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#7C6CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginBottom: 24 }}>
                <BrandGradient colors={['#7C6CFF', '#42E8CF'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 16 }}>
                  <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#080A10', fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>
                      {isSubmitting ? 'Verifying...' : 'Login'}
                    </Text>
                  </View>
                </BrandGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, opacity: 0.6 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
                <Text style={{ color: '#6F7687', fontSize: 11, fontWeight: '700', marginHorizontal: 16, letterSpacing: 1 }}>OR</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              </View>

              {/* Social Logins */}
              <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, paddingVertical: 14, marginBottom: 12 }}>
                <Globe color="#F5F7FC" size={18} style={{ marginRight: 10 }} />
                <Text style={{ color: '#F5F7FC', fontSize: 14, fontWeight: '700' }}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 16, paddingVertical: 14 }}>
                <Download color="#F5F7FC" size={18} style={{ marginRight: 10 }} />
                <Text style={{ color: '#F5F7FC', fontSize: 14, fontWeight: '700' }}>Continue with Apple</Text>
              </TouchableOpacity>
            </GlassCard>

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
              <Text style={{ color: '#A7ADBC', fontSize: 15 }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register' as any)}>
                <Text style={{ color: '#42E8CF', fontSize: 15, fontWeight: '700' }}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ForgeBackground>
  );
}
