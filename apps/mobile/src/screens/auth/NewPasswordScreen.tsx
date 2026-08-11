import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import { AuthStackParamList } from '../../navigation/types';
import { z } from 'zod';
import { Input } from '../../components/forms/Input';
import { BrandGradient } from '../../components/ui/BrandGradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'NewPassword'>;

const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type NewPasswordPayload = z.infer<typeof newPasswordSchema>;

export default function NewPasswordScreen({ navigation }: Props) {
  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<NewPasswordPayload>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    // Simple password strength calculator
    let s = 0;
    if (password.length > 5) s++;
    if (password.length > 8) s++;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(Math.min(4, s));
  }, [password]);

  const onSubmit = async (data: NewPasswordPayload) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Navigate to Login after success
      navigation.navigate('Login' as any);
    } catch (e: any) {
      alert(e.message || 'Failed to update password');
    }
  };

  const getStrengthLabel = () => {
    if (strength === 0) return 'NONE';
    if (strength === 1) return 'WEAK';
    if (strength === 2) return 'FAIR';
    if (strength >= 3) return 'STRONG';
    return 'WEAK';
  };

  const getStrengthColor = () => {
    if (strength >= 3) return '#44eac3'; // Mint
    if (strength === 2) return '#ffb68c'; // Orange
    return '#ffb4ab'; // Red/Error
  };

  return (
    <View className="flex-1 bg-[#13121c]">
      {/* Background Decor */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: '-15%', left: '-15%', width: 500, height: 500, borderRadius: 250, backgroundColor: 'rgba(180,95,36,0.2)', transform: [{ scale: 1.5 }] }} />
        <View style={{ position: 'absolute', top: '30%', right: '-20%', width: 600, height: 600, borderRadius: 300, backgroundColor: 'rgba(108,92,255,0.15)', transform: [{ scale: 1.5 }] }} />
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
            <View className="mb-8 items-center text-center">
              <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#e5e0ee', textAlign: 'center' }}>
                NEW <Text style={{ color: '#ffb68c' }}>PASSWORD</Text>
              </Text>
              <Text style={{ color: '#918ea1', fontSize: 14, textAlign: 'center', marginTop: 12, maxWidth: 280, alignSelf: 'center' }}>
                Time for a fresh start. Choose a strong one this time!
              </Text>
            </View>

            {/* Glass Form Card */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }} className="shadow-2xl">
              
              <Input
                name="password"
                control={control}
                label="New Password"
                placeholder="Enter new password"
                isPassword
                iconName="lock"
              />

              <Input
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                placeholder="Re-enter password"
                isPassword
                iconName="lock"
              />

              {/* Security Strength Bar */}
              <View style={{ backgroundColor: '#1b1b24', borderRadius: 12, padding: 16, marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Security Strength</Text>
                  <View style={{ backgroundColor: 'rgba(68,234,195,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(68,234,195,0.2)' }}>
                    <Text style={{ color: getStrengthColor(), fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{getStrengthLabel()}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', height: 6, gap: 4 }}>
                  <View style={{ flex: 1, borderRadius: 3, backgroundColor: strength >= 1 ? '#6c5cff' : '#35343e' }} />
                  <BrandGradient style={{ flex: 1, borderRadius: 3, opacity: strength >= 2 ? 1 : 0.2 }} colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                  <View style={{ flex: 1, borderRadius: 3, backgroundColor: strength >= 3 ? '#44eac3' : '#35343e' }} />
                  <View style={{ flex: 1, borderRadius: 3, backgroundColor: strength >= 4 ? '#44eac3' : '#35343e' }} />
                </View>
              </View>

            </View>

            <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginTop: 24 }}>
              <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999 }}>
                <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#13121c', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginRight: 8 }}>
                    {isSubmitting ? 'Updating...' : 'Update Password'}
                  </Text>
                  <ArrowRight color="#13121c" size={18} />
                </View>
              </BrandGradient>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
