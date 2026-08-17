import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Zap } from 'lucide-react-native';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/forms/Input';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordPayload) => {
    console.log('Password reset requested for:', data.email);
    // Mock network request
    await new Promise((res) => setTimeout(res, 1000));
    navigation.navigate('CheckEmail' as any);
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
              <View style={{ backgroundColor: 'rgba(66, 232, 207, 0.1)', borderWidth: 1, borderColor: 'rgba(66, 232, 207, 0.3)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#42E8CF', marginRight: 8 }} />
                <Text style={{ color: '#42E8CF', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>ACCOUNT RECOVERY</Text>
              </View>

              <Text style={{ fontSize: 32, fontWeight: '900', color: '#F5F7FC', textAlign: 'center', letterSpacing: -0.5 }}>Reset Password</Text>
              
              <Text style={{ color: '#A7ADBC', fontSize: 14, textAlign: 'center', marginTop: 8, maxWidth: 300, alignSelf: 'center', lineHeight: 20 }}>
                Enter your email address below and we will send you a reset link to recover your account.
              </Text>
            </View>

            {/* Glass Form Card */}
            <GlassCard variant="hero" style={{ padding: 0 }} contentStyle={{ padding: 24 }}>
              
              <Input
                name="email"
                control={control}
                label="Email Address"
                placeholder="athlete@forgeai.app"
                keyboardType="email-address"
                autoCapitalize="none"
                iconName="mail"
              />

              <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#7C6CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginTop: 16 }}>
                <BrandGradient colors={['#7C6CFF', '#42E8CF'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 16 }}>
                  <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#080A10', fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginRight: 8 }}>
                      {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Text>
                    <Zap color="#080A10" size={18} />
                  </View>
                </BrandGradient>
              </TouchableOpacity>
            </GlassCard>

            {/* Footer */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
              <TouchableOpacity onPress={() => navigation.navigate('Login' as any)}>
                <Text style={{ color: '#42E8CF', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 }}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ForgeBackground>
  );
}
