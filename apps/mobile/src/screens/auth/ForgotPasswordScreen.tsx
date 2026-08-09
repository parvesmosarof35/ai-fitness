import React from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';
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
      className="flex-1 bg-zinc-900"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
          <Text className="text-emerald-400 font-bold">← Back to Login</Text>
        </TouchableOpacity>

        <Text className="text-4xl font-bold text-white mb-2">Reset Password</Text>
        
        {isSent ? (
          <View className="mt-8">
            <Text className="text-zinc-300 text-lg mb-8">
              If an account exists with that email, a password reset link has been sent.
            </Text>
            <Button 
              label="Return to Login" 
              variant="outline"
              onPress={() => navigation.navigate('Login')} 
            />
          </View>
        ) : (
          <View>
            <Text className="text-zinc-400 mb-8">
              Enter your email address and we will send you instructions to reset your password.
            </Text>

            <Input
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View className="mt-8">
              <Button 
                label="Send Reset Link" 
                onPress={handleSubmit(onSubmit)} 
                loading={isSubmitting} 
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
