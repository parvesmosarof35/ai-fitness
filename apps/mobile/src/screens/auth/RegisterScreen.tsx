import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Globe, Download } from 'lucide-react-native';

import * as Crypto from 'expo-crypto';
import { AuthStackParamList } from '../../navigation/types';
import { registerSchema, RegisterPayload } from '../../schemas/profile';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/forms/Input';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const signIn = useAuthStore((state) => state.signIn);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterPayload) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const user = {
        id: Crypto.randomUUID(),
        email: data.email,
        hasCompletedOnboarding: false,
      };
      await signIn(user);
    } catch (e: any) {
      alert(e.message || 'Registration failed');
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
              <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', textAlign: 'center', letterSpacing: -0.5 }}>Create Account</Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#A7ADBC', textAlign: 'center', marginTop: 6 }}>Join Forge AI to start your personalized fitness plan</Text>
            </View>

            {/* Glass Form Card */}
            <GlassCard variant="hero" style={{ padding: 0 }} contentStyle={{ padding: 24 }}>
              
              <Input
                name="fullName"
                control={control}
                label="Full Name"
                placeholder="Alex Morgan"
                autoCapitalize="words"
                iconName="user"
              />

              <Input
                name="email"
                control={control}
                label="Email Address"
                placeholder="athlete@forgeai.app"
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
                iconName="lock"
              />

              <Input
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                placeholder="••••••••"
                isPassword
                iconName="shield"
              />

              <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#7C6CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginBottom: 24, marginTop: 8 }}>
                <BrandGradient colors={['#7C6CFF', '#42E8CF'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 16 }}>
                  <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#080A10', fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' }}>
                      {isSubmitting ? 'Processing...' : 'Create Account'}
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
              <Text style={{ color: '#A7ADBC', fontSize: 15 }}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as any)}>
                <Text style={{ color: '#42E8CF', fontSize: 15, fontWeight: '700' }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ForgeBackground>
  );
}
