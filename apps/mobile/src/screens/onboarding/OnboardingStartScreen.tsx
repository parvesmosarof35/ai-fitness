import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingPayload } from '../../schemas/profile';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';
import { Select } from '../../components/forms/Select';
import { useAuthStore } from '../../store/authStore';
import { ftInToCm, lbsToKg } from '../../features/onboarding/utils';
import { apiClient } from '../../services/api/client';

export default function OnboardingStartScreen() {
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);

  const { control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<OnboardingPayload>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      language: 'en',
      unitSystem: 'metric',
      healthDisclaimerAccepted: true as const,
    },
  });

  const unitSystem = watch('unitSystem');

  const onSubmit = async (data: OnboardingPayload) => {
    let finalHeightCm = data.heightCm;
    let finalWeightKg = data.weightKg;

    if (data.unitSystem === 'imperial') {
      finalHeightCm = ftInToCm(data.heightFt || 0, data.heightIn || 0);
      finalWeightKg = lbsToKg(data.weightLbs || 0);
    }

    console.log('Normalized payload:', { ...data, finalHeightCm, finalWeightKg });
    
    try {
      await apiClient.put('/me/profile/onboarding', {
        age: Number(data.age),
        language: data.language,
        unitSystem: data.unitSystem,
        heightCm: finalHeightCm,
        weightKg: finalWeightKg,
        primaryGoal: data.goals,
        activityLevel: data.activityLevel,
        dailyTimeMinutes: Number(data.dailyTimeMinutes),
        dietaryPreferences: data.dietaryPreferences ? [data.dietaryPreferences] : [],
        healthDisclaimerAccepted: data.healthDisclaimerAccepted
      });
      await completeOnboarding();
    } catch (e: any) {
      Alert.alert("Onboarding Error", e.message || "Failed to save profile");
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-zinc-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
        <Text className="text-3xl font-bold text-white mb-2">Step {step} of 4</Text>
        
        {step === 1 && (
          <View>
            <Text className="text-zinc-400 mb-8">Let's start with the basics.</Text>
            <Input name="age" control={control} label="Age" keyboardType="numeric" placeholder="e.g. 25" />
            <Select name="language" control={control} label="Language" options={[
              { label: 'English', value: 'en' },
              { label: 'Bangla', value: 'bn' }
            ]} />
            <Select name="unitSystem" control={control} label="Measurement Units" options={[
              { label: 'Metric (cm/kg)', value: 'metric' },
              { label: 'Imperial (ft/lbs)', value: 'imperial' }
            ]} />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text className="text-zinc-400 mb-8">Enter your body measurements.</Text>
            {unitSystem === 'metric' ? (
              <>
                <Input name="heightCm" control={control} label="Height (cm)" keyboardType="numeric" placeholder="e.g. 175" />
                <Input name="weightKg" control={control} label="Weight (kg)" keyboardType="numeric" placeholder="e.g. 70" />
              </>
            ) : (
              <>
                <View className="flex-row justify-between" style={{ gap: 8 }}>
                  <View className="flex-1">
                    <Input name="heightFt" control={control} label="Height (ft)" keyboardType="numeric" placeholder="e.g. 5" />
                  </View>
                  <View className="flex-1">
                    <Input name="heightIn" control={control} label="Height (in)" keyboardType="numeric" placeholder="e.g. 9" />
                  </View>
                </View>
                <Input name="weightLbs" control={control} label="Weight (lbs)" keyboardType="numeric" placeholder="e.g. 150" />
              </>
            )}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text className="text-zinc-400 mb-8">What are your fitness goals?</Text>
            <Select name="goals" control={control} label="Main Goal" options={[
              { label: 'Lose Weight', value: 'lose_weight' },
              { label: 'Build Muscle', value: 'build_muscle' },
              { label: 'Stay Fit', value: 'stay_fit' }
            ]} />
            <Select name="activityLevel" control={control} label="Activity Level" options={[
              { label: 'Sedentary', value: 'sedentary' },
              { label: 'Active', value: 'active' },
              { label: 'Athlete', value: 'athlete' }
            ]} />
            <Input name="dailyTimeMinutes" control={control} label="Daily Time Commitment (minutes)" keyboardType="numeric" placeholder="e.g. 30" />
          </View>
        )}

        {step === 4 && (
          <View>
            <Text className="text-zinc-400 mb-8">Final Details.</Text>
            <Input name="dietaryPreferences" control={control} label="Dietary Preferences (Optional)" placeholder="e.g. Vegan, Keto" />
            <View className="mt-8 bg-zinc-800 p-4 rounded-xl border border-zinc-700">
              <Text className="text-white font-bold mb-2">Health Disclaimer</Text>
              <Text className="text-zinc-400 text-sm">
                This app provides fitness recommendations and pose tracking based on AI models. 
                It is not a substitute for professional medical advice, diagnosis, or treatment. 
                By proceeding, you accept that you are participating at your own risk.
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row justify-between mt-8" style={{ gap: 16 }}>
          {step > 1 ? (
            <View className="flex-1">
              <Button label="Back" variant="secondary" onPress={prevStep} disabled={isSubmitting} />
            </View>
          ) : <View className="flex-1" />}
          
          <View className="flex-1">
            {step < 4 ? (
              <Button label="Next" onPress={nextStep} />
            ) : (
              <Button label="Complete" onPress={handleSubmit(onSubmit, (err) => {
                Alert.alert("Validation Error", "Please review your inputs across all steps.");
                console.log('Validation errors', err);
              })} loading={isSubmitting} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
