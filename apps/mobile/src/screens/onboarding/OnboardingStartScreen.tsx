import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingPayload } from '../../schemas/profile';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/forms/Button';
import { useAuthStore } from '../../store/authStore';
import { ftInToCm, lbsToKg } from '../../features/onboarding/utils';
import { localStore, StorageKeys } from '../../services/storage/localStore';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { TouchableCard } from '../../components/ui/Card';
import { Target, Zap, Activity, Dumbbell, Flame, CheckCircle2 } from 'lucide-react-native';

const TOTAL_STEPS = 4;

export default function OnboardingStartScreen() {
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm<OnboardingPayload>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      language: 'en',
      unitSystem: 'metric',
      healthDisclaimerAccepted: true as const,
      goals: 'lose_weight',
      activityLevel: 'active',
      dailyTimeMinutes: 30,
    },
    mode: 'onTouched',
  });

  const unitSystem = watch('unitSystem');
  const selectedGoal = watch('goals');
  const selectedActivity = watch('activityLevel');

  const onSubmit = async (data: OnboardingPayload) => {
    let finalHeightCm = data.heightCm;
    let finalWeightKg = data.weightKg;

    if (data.unitSystem === 'imperial') {
      finalHeightCm = ftInToCm(data.heightFt || 0, data.heightIn || 0);
      finalWeightKg = lbsToKg(data.weightLbs || 0);
    }

    try {
      const profile = {
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
      };
      
      const success = await localStore.setItem(StorageKeys.ONBOARDING_PROFILE, profile);
      if (!success) {
        throw new Error("Failed to save profile locally");
      }
      
      await completeOnboarding();
    } catch (e: any) {
      Alert.alert("Onboarding Error", e.message || "Failed to save profile");
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['age', 'unitSystem'];
    if (step === 2) {
      fieldsToValidate = unitSystem === 'metric' 
        ? ['heightCm', 'weightKg'] 
        : ['heightFt', 'heightIn', 'weightLbs'];
    }
    if (step === 3) fieldsToValidate = ['goals', 'activityLevel'];
    if (step === 4) fieldsToValidate = ['healthDisclaimerAccepted'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(s => Math.min(s + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-zinc-950">
      
      {/* Header Progress */}
      <View className="px-6 pt-12 pb-4 bg-zinc-950/80">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-zinc-400 font-medium tracking-wider uppercase text-xs">Step {step} of {TOTAL_STEPS}</Text>
        </View>
        <ProgressBar progress={(step / TOTAL_STEPS) * 100} height={6} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        
        {step === 1 && (
          <View className="flex-1 justify-center">
            <Text className="text-4xl font-black text-white mb-2">Welcome to AI Fitness</Text>
            <Text className="text-lg text-zinc-400 mb-10">Let&apos;s personalize your journey.</Text>
            
            <View className="space-y-4">
              <Input name="age" control={control} label="Your Age" keyboardType="numeric" placeholder="e.g. 25" />
              
              <View className="mt-4">
                <Text className="text-zinc-400 mb-2 font-medium">Measurement Units</Text>
                <View className="flex-row gap-4">
                  <TouchableCard 
                    className="flex-1 items-center py-4"
                    active={unitSystem === 'metric'}
                    onPress={() => setValue('unitSystem', 'metric')}
                  >
                    <Text className={`font-bold ${unitSystem === 'metric' ? 'text-emerald-400' : 'text-zinc-400'}`}>Metric (cm/kg)</Text>
                  </TouchableCard>
                  <TouchableCard 
                    className="flex-1 items-center py-4"
                    active={unitSystem === 'imperial'}
                    onPress={() => setValue('unitSystem', 'imperial')}
                  >
                    <Text className={`font-bold ${unitSystem === 'imperial' ? 'text-emerald-400' : 'text-zinc-400'}`}>Imperial (ft/lbs)</Text>
                  </TouchableCard>
                </View>
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-white mb-2">Body Metrics</Text>
            <Text className="text-zinc-400 mb-8">This helps us calculate your macros and calorie burn accurately.</Text>
            
            <View className="space-y-6">
              {unitSystem === 'metric' ? (
                <>
                  <Input name="heightCm" control={control} label="Height (cm)" keyboardType="numeric" placeholder="e.g. 175" />
                  <Input name="weightKg" control={control} label="Weight (kg)" keyboardType="numeric" placeholder="e.g. 70" />
                </>
              ) : (
                <>
                  <View className="flex-row gap-4">
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
          </View>
        )}

        {step === 3 && (
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-white mb-2">Your Main Goal</Text>
            <Text className="text-zinc-400 mb-8">What do you want to achieve?</Text>
            
            <View className="space-y-4">
              <TouchableCard 
                className="flex-row items-center p-5 mb-4"
                active={selectedGoal === 'lose_weight'}
                onPress={() => setValue('goals', 'lose_weight')}
              >
                <Flame color={selectedGoal === 'lose_weight' ? '#34d399' : '#a1a1aa'} size={32} />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-white">Lose Weight</Text>
                  <Text className="text-zinc-400 text-sm">Burn fat and get leaner</Text>
                </View>
              </TouchableCard>

              <TouchableCard 
                className="flex-row items-center p-5 mb-4"
                active={selectedGoal === 'build_muscle'}
                onPress={() => setValue('goals', 'build_muscle')}
              >
                <Dumbbell color={selectedGoal === 'build_muscle' ? '#34d399' : '#a1a1aa'} size={32} />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-white">Build Muscle</Text>
                  <Text className="text-zinc-400 text-sm">Gain size and strength</Text>
                </View>
              </TouchableCard>

              <TouchableCard 
                className="flex-row items-center p-5 mb-8"
                active={selectedGoal === 'stay_fit'}
                onPress={() => setValue('goals', 'stay_fit')}
              >
                <Activity color={selectedGoal === 'stay_fit' ? '#34d399' : '#a1a1aa'} size={32} />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-bold text-white">Stay Fit</Text>
                  <Text className="text-zinc-400 text-sm">Maintain health and mobility</Text>
                </View>
              </TouchableCard>

              <Text className="text-white font-bold mb-2">Activity Level</Text>
              <View className="flex-row gap-3">
                {['sedentary', 'active', 'athlete'].map(level => (
                  <TouchableCard 
                    key={level}
                    className="flex-1 items-center p-3"
                    active={selectedActivity === level}
                    onPress={() => setValue('activityLevel', level as any)}
                  >
                    <Text className={`font-bold capitalize ${selectedActivity === level ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {level}
                    </Text>
                  </TouchableCard>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 4 && (
          <View className="flex-1 justify-center">
            <View className="items-center mb-8">
              <View className="bg-emerald-500/20 p-6 rounded-full mb-6">
                <CheckCircle2 color="#34d399" size={64} />
              </View>
              <Text className="text-3xl font-bold text-white text-center mb-2">You&apos;re All Set!</Text>
              <Text className="text-zinc-400 text-center">Our AI will generate your personalized workout plan.</Text>
            </View>

            <View className="bg-zinc-800 p-5 rounded-2xl border border-zinc-700/50 mb-8">
              <Text className="text-emerald-400 font-bold mb-2 uppercase tracking-wider text-xs">Health Disclaimer</Text>
              <Text className="text-zinc-300 leading-relaxed text-sm mb-4">
                This app provides fitness recommendations based on AI models. 
                It is not a substitute for professional medical advice. 
                By proceeding, you accept that you are participating at your own risk.
              </Text>
              
              <Controller
                control={control}
                name="healthDisclaimerAccepted"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity 
                    className="flex-row items-center mt-2" 
                    onPress={() => onChange(!value)}
                    activeOpacity={0.7}
                  >
                    <View className={`w-6 h-6 rounded border items-center justify-center mr-3 ${value ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-500'}`}>
                      {value && <CheckCircle2 color="#09090b" size={16} />}
                    </View>
                    <Text className="text-white flex-1">I accept the health disclaimer</Text>
                  </TouchableOpacity>
                )}
              />
              {errors.healthDisclaimerAccepted && (
                <Text className="text-red-500 text-xs mt-2">{errors.healthDisclaimerAccepted.message}</Text>
              )}
            </View>
          </View>
        )}

        {/* Footer Actions */}
        <View className="flex-row gap-4 mt-8 pt-4">
          {step > 1 && (
            <View className="flex-1">
              <Button label="Back" variant="secondary" onPress={prevStep} disabled={isSubmitting} />
            </View>
          )}
          
          <View className="flex-[2]">
            {step < TOTAL_STEPS ? (
              <Button label="Continue" onPress={nextStep} />
            ) : (
              <Button 
                label="Start My Journey" 
                onPress={handleSubmit(onSubmit, (err) => {
                  Alert.alert("Validation Error", "Please fill in all required fields correctly.");
                  console.log('Validation errors', err);
                })} 
                loading={isSubmitting} 
              />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
