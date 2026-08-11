import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Zap } from 'lucide-react-native';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/forms/Input';
import { BrandGradient } from '../../components/ui/BrandGradient';
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
    <View className="flex-1 bg-[#13121c]">
      {/* Background Decor */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500, borderRadius: 250, backgroundColor: 'rgba(108,92,255,0.15)', transform: [{ scale: 1.5 }] }} />
        <View style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 600, height: 600, borderRadius: 300, backgroundColor: 'rgba(68,234,195,0.1)', transform: [{ scale: 1.5 }] }} />
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
              <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#44eac3', marginRight: 8 }} />
                <Text style={{ color: '#44eac3', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>SECURE RECOVERY</Text>
              </View>

              <Text style={{ fontSize: 32, fontWeight: '900', letterSpacing: -1, lineHeight: 36, color: '#e5e0ee', textAlign: 'center' }}>
                RESET <Text style={{ color: '#44eac3' }}>PASSWORD</Text>
              </Text>
              
              <Text style={{ color: '#918ea1', fontSize: 14, textAlign: 'center', marginTop: 12, maxWidth: 280, alignSelf: 'center' }}>
                No sweat! Enter your email and we'll get you back to the grind.
              </Text>
            </View>

            {/* Glass Form Card */}
            <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }} className="shadow-2xl">
              
              <Input
                name="email"
                control={control}
                label="AI ID (Email)"
                placeholder="operative@forge.ai"
                keyboardType="email-address"
                autoCapitalize="none"
                iconName="mail"
              />

              <TouchableOpacity onPress={handleSubmit(onSubmit)} activeOpacity={0.8} style={{ shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginTop: 16 }}>
                <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999 }}>
                  <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#13121c', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginRight: 8 }}>
                      {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Text>
                    <Zap color="#13121c" size={18} />
                  </View>
                </BrandGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row justify-center mt-8">
              <TouchableOpacity onPress={() => navigation.navigate('Login' as any)}>
                <Text style={{ color: '#6c5cff', fontSize: 12, fontWeight: '700', textDecorationLine: 'underline', letterSpacing: 1 }}>BACK TO LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
