import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';
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
  const [isSent, setIsSent] = React.useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordPayload) => {
    console.log('Password reset requested for:', data.email);
    await new Promise((res) => setTimeout(res, 1000));
    setIsSent(true);
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

        <View className="px-8 pt-12 pb-12 flex-1 justify-center">
          {isSent ? (
            <>
              <View className="mb-10 items-center">
                <Text className="text-5xl font-black text-brand-purple leading-tight tracking-tight">CHECK</Text>
                <Text className="text-5xl font-black text-white tracking-tight">EMAIL</Text>
                <Text className="text-zinc-400 text-center mt-6 px-4">
                  We sent a magic link to your inbox. Tap it to get back in the game.
                </Text>
              </View>

              <View className="mt-4">
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Login')}>
                  <BrandGradient className="px-6 py-4 rounded-full flex-row justify-center items-center">
                    <Mail color="#09090b" size={20} className="mr-3" />
                    <Text className="text-zinc-950 font-black uppercase tracking-wider text-sm">Open Mail App</Text>
                  </BrandGradient>
                </TouchableOpacity>

                <TouchableOpacity className="mt-8 self-center" onPress={() => setIsSent(false)}>
                  <Text className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Resend Email</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View className="mb-10">
                <Text className="text-5xl font-black text-brand-cyan leading-tight tracking-tight">RESET</Text>
                <Text className="text-5xl font-black text-white tracking-tight">PASSWORD</Text>
                <Text className="text-zinc-400 mt-6">
                  No sweat! Enter your email and we&apos;ll get you back to the grind.
                </Text>
              </View>

              <View className="bg-surface-highlight/30 p-6 rounded-[32px] border border-white/5 mb-8">
                <Input
                  name="email"
                  control={control}
                  label="Email"
                  placeholder="GymHero@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  iconName="mail"
                />

                <View className="mt-4">
                  <Button 
                    label="Send Reset Link" 
                    onPress={handleSubmit(onSubmit)} 
                    loading={isSubmitting} 
                    variant="primary"
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
