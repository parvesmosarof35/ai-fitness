import React, { useState, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingPayload } from '../../schemas/profile';
import { Input } from '../../components/forms/Input';
import { AgeWheelPicker } from '../../components/forms/AgeWheelPicker';
import { VerticalWheelPicker } from '../../components/forms/VerticalWheelPicker';
import { useAuthStore } from '../../store/authStore';
import { ftInToCm, lbsToKg } from '../../features/onboarding/utils';
import { localStore, StorageKeys } from '../../services/storage/localStore';
import { ArrowLeft, Sparkles, User, Dumbbell, Activity, Zap, Timer, Brain, ArrowRight, Home, TreePine, CheckCircle2, Loader2, Camera, ImagePlus, Ruler } from 'lucide-react-native';
import { BrandGradient } from '../../components/ui/BrandGradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence, withSpring } from 'react-native-reanimated';

const TOTAL_STEPS = 5;

// Mock images for the glowing brain
const BRAIN_IMG_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDfqUcraTpwPJKQV5F2oIUKAU_T_3Q-ThFMNs4GIFfTC2IjOWn3uSEzMc6SBpVxdIyEj6dgskhjHF3kj7qTFXyTuM6B7OKpckJM6cGuPt_5eAKV3DVA_HfnUE1gIKJqIE42HMZ21ONZJfiF0hF86RhPhalEa8el6UIdhtadDx7zUhCtisqRgX-9dP8JjKRjKJGVIzD9XjIaUWz5rU92e6iHqowlAWW-8sBhzfIHfQLCq30Pz6ZH1647";

export default function OnboardingStartScreen() {
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<OnboardingPayload>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      displayName: '',
      age: undefined,
      language: 'en',
      heightUnit: 'ft',
      weightUnit: 'kg',
      goals: 'build_muscle',
      workoutEnvironment: 'gym',
      workoutDaysPerWeek: 4,
      healthDisclaimerAccepted: true,
    },
    mode: 'onTouched',
  });

  const heightUnit = watch('heightUnit');
  const weightUnit = watch('weightUnit');
  const selectedGoal = watch('goals');
  const workoutEnvironment = watch('workoutEnvironment');
  const workoutDays = watch('workoutDaysPerWeek');

  const onSubmit = async (data: OnboardingPayload) => {
    let finalHeightCm = data.heightCm;
    let finalWeightKg = data.weightKg;

    if (data.heightUnit === 'ft') {
      finalHeightCm = ftInToCm(data.heightFt || 0, data.heightIn || 0);
    }
    if (data.weightUnit === 'lbs') {
      finalWeightKg = lbsToKg(data.weightLbs || 0);
    }

    try {
      const profile = {
        displayName: data.displayName,
        age: Number(data.age),
        language: data.language,
        heightUnit: data.heightUnit,
        weightUnit: data.weightUnit,
        heightCm: finalHeightCm,
        weightKg: finalWeightKg,
        primaryGoal: data.goals,
        workoutEnvironment: data.workoutEnvironment,
        workoutDaysPerWeek: Number(data.workoutDaysPerWeek),
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
    if (step === 1) fieldsToValidate = ['displayName', 'age'];
    if (step === 2) {
      if (heightUnit === 'cm') fieldsToValidate.push('heightCm');
      else fieldsToValidate.push('heightFt', 'heightIn');
      if (weightUnit === 'kg') fieldsToValidate.push('weightKg');
      else fieldsToValidate.push('weightLbs');
    }
    if (step === 3) fieldsToValidate = ['goals'];
    if (step === 4) fieldsToValidate = ['workoutEnvironment', 'workoutDaysPerWeek'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      if (step === 4) {
        setStep(5);
        setIsProcessing(true);
        setTimeout(() => {
          handleSubmit(onSubmit)();
        }, 3000); // Fake processing delay for Step 5
      } else {
        setStep(s => Math.min(s + 1, TOTAL_STEPS));
      }
    }
  };

  const prevStep = () => {
    if (step > 1 && step < 5) {
      setStep(s => s - 1);
    }
  };

  // Rotating animation for step 5
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (step === 5) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 15000, easing: Easing.linear }),
        -1
      );
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1
      );
    }
  }, [step]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const renderProgress = () => {
    const percentage = (step / TOTAL_STEPS) * 100;
    
    return (
      <View className="w-full mb-8 z-10 px-6">
        <View className="flex-row justify-between items-end mb-2">
          <Text style={{ color: '#44eac3', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            STEP {step} OF {TOTAL_STEPS}
          </Text>
          <Text style={{ color: '#c8c4d8', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>
            {Math.round(percentage)}% Complete
          </Text>
        </View>
        <View style={{ height: 4, backgroundColor: '#35343e', borderRadius: 2, overflow: 'hidden', flexDirection: 'row' }}>
          <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: '#44eac3', borderRadius: 2, shadowColor: '#44eac3', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 }} />
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#13121c]">
      {/* Background Decor (Cyber Gradient & Orbs) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: step === 5 ? '10%' : '-10%', left: step === 5 ? '-10%' : '-20%', width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(108,92,255,0.15)', filter: 'blur(50px)', transform: [{ scale: 1.5 }] }} />
        <View style={{ position: 'absolute', bottom: '10%', right: step === 5 ? '-10%' : '-20%', width: 300, height: 300, borderRadius: 150, backgroundColor: step === 5 ? 'rgba(0,205,168,0.15)' : 'rgba(68,234,195,0.1)', filter: 'blur(50px)', transform: [{ scale: 1.5 }] }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        
        {/* Top Header */}
        {step < 5 && (
          <View style={{ paddingTop: Platform.OS === 'android' ? 60 : 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
            {step > 1 ? (
              <TouchableOpacity onPress={prevStep} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft color="#918ea1" size={20} />
              </TouchableOpacity>
            ) : <View style={{ width: 40, height: 40 }} />}
            
            <View className="flex-row items-center gap-2">
              <Dumbbell color="#6c5cff" size={20} />
              <Text style={{ color: '#e5e0ee', fontSize: 12, fontWeight: '700', letterSpacing: 2.4 }} className="uppercase">FORGE AI</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        )}

        {step === 5 && (
          <View style={{ paddingTop: Platform.OS === 'android' ? 60 : 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
            <View style={{ width: 40, height: 40 }} />
            <View className="flex-row items-center gap-2">
              <Dumbbell color="#6c5cff" size={20} />
              <Text style={{ color: '#e5e0ee', fontSize: 12, fontWeight: '700', letterSpacing: 2.4 }} className="uppercase">FORGE AI</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        )}

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 20 }} bounces={false} keyboardShouldPersistTaps="handled">
          
          {step < 5 && renderProgress()}

          {/* STEP 1: Let's Start */}
          {step === 1 && (
            <View className="flex-1 px-6">
              <View className="mb-6 relative">
                <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: 'transparent' }}>
                  <Text style={{ color: '#6c5cff' }}>LET'S</Text>{' '}
                  <Zap color="#44eac3" size={36} style={{ top: 5 }} />
                </Text>
                <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: '#ffb68c' }}>START</Text>
              </View>

              <View className="items-center mb-8">
                <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center' }}>
                  <View style={{ position: 'relative', marginBottom: 16 }}>
                    <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#6c5cff', backgroundColor: '#201f28', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <User color="#918ea1" size={40} />
                    </View>
                    <View style={{ position: 'absolute', bottom: -4, right: -4, width: 36, height: 36, borderRadius: 18, backgroundColor: '#6c5cff', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#13121c' }}>
                      <ImagePlus color="#ffffff" size={18} />
                    </View>
                  </View>
                  <Text style={{ color: '#c8c4d8', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>UPLOAD PHOTO</Text>
                </TouchableOpacity>
              </View>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }}>
                <Input name="displayName" control={control} label="Display Name" placeholder="e.g. John Doe" autoCapitalize="words" />
                
                <View style={{ marginTop: 16 }}>
                  <Controller
                    control={control}
                    name="age"
                    render={({ field: { onChange, value } }) => (
                      <AgeWheelPicker
                        value={value as number}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors.age && (
                    <Text style={{ color: '#ffb4ab', fontSize: 12, marginTop: 4, marginLeft: 12 }}>
                      {errors.age.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* STEP 2: Body Metrics */}
          {step === 2 && (
            <View className="flex-1 px-6">
              <View className="mb-8">
                <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#e5e0ee' }}>BODY</Text>
                <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#44eac3' }}>METRICS</Text>
              </View>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24 }}>
                
                <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center' }}>
                  <View style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ruler color="#918ea1" size={14} />
                    <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>HEIGHT</Text>
                  </View>
                  <View style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', backgroundColor: '#2a2933', borderRadius: 9999, padding: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                    <TouchableOpacity onPress={() => setValue('heightUnit', 'cm')} style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, backgroundColor: heightUnit === 'cm' ? 'rgba(68,234,195,0.2)' : 'transparent' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: heightUnit === 'cm' ? '#44eac3' : '#918ea1' }}>CM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setValue('heightUnit', 'ft')} style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, backgroundColor: heightUnit === 'ft' ? 'rgba(68,234,195,0.2)' : 'transparent' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: heightUnit === 'ft' ? '#44eac3' : '#918ea1' }}>FT/IN</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 48 }} />
                  {heightUnit === 'cm' ? (
                    <Controller control={control} name="heightCm" render={({ field: { onChange, value } }) => (
                      <VerticalWheelPicker value={value || 170} onChange={onChange} min={100} max={250} unit="CM" />
                    )} />
                  ) : (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                      <View style={{ flex: 1 }}>
                        <Controller control={control} name="heightFt" render={({ field: { onChange, value } }) => (
                          <VerticalWheelPicker value={value || 5} onChange={onChange} min={3} max={8} unit="FT" />
                        )} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Controller control={control} name="heightIn" render={({ field: { onChange, value } }) => (
                          <VerticalWheelPicker value={value || 8} onChange={onChange} min={0} max={11} unit="IN" />
                        )} />
                      </View>
                    </View>
                  )}
                </View>

                <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, alignItems: 'center' }}>
                  <View style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Activity color="#918ea1" size={14} />
                    <Text style={{ color: '#918ea1', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>WEIGHT</Text>
                  </View>
                  <View style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row', backgroundColor: '#2a2933', borderRadius: 9999, padding: 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                    <TouchableOpacity onPress={() => setValue('weightUnit', 'kg')} style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, backgroundColor: weightUnit === 'kg' ? 'rgba(68,234,195,0.2)' : 'transparent' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: weightUnit === 'kg' ? '#44eac3' : '#918ea1' }}>KG</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setValue('weightUnit', 'lbs')} style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, backgroundColor: weightUnit === 'lbs' ? 'rgba(68,234,195,0.2)' : 'transparent' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: weightUnit === 'lbs' ? '#44eac3' : '#918ea1' }}>LBS</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 48 }} />
                  {weightUnit === 'kg' ? (
                    <Controller control={control} name="weightKg" render={({ field: { onChange, value } }) => (
                      <VerticalWheelPicker value={value || 70} onChange={onChange} min={30} max={200} unit="KG" />
                    )} />
                  ) : (
                    <Controller control={control} name="weightLbs" render={({ field: { onChange, value } }) => (
                      <VerticalWheelPicker value={value || 150} onChange={onChange} min={60} max={400} unit="LBS" />
                    )} />
                  )}
                </View>

              </View>
            </View>
          )}

          {/* STEP 3: Your Goal */}
          {step === 3 && (
            <View className="flex-1 px-6">
              <View className="mb-8">
                <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#e5e0ee' }}>YOUR</Text>
                <Text style={{ fontSize: 36, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#ffb68c' }}>GOAL</Text>
              </View>

              <View className="flex-row flex-wrap justify-between">
                {[
                  { id: 'lose_weight', label: 'Lose Weight', icon: Activity },
                  { id: 'build_muscle', label: 'Build Muscle', icon: Dumbbell },
                  { id: 'stay_fit', label: 'Stay Fit', icon: Timer }, // Placeholder icon mapping
                  { id: 'gain_strength', label: 'Gain Strength', icon: Zap },
                  { id: 'improve_endurance', label: 'Improve Endurance', icon: Timer },
                  { id: 'improve_flexibility', label: 'Improve Flexibility', icon: User },
                ].map((goal) => {
                  const isActive = selectedGoal === goal.id;
                  const Icon = goal.icon;
                  return (
                    <TouchableOpacity
                      key={goal.id}
                      onPress={() => setValue('goals', goal.id as any)}
                      activeOpacity={0.7}
                      style={{
                        width: '48%',
                        backgroundColor: isActive ? 'rgba(0,205,168,0.1)' : 'rgba(255,255,255,0.03)',
                        borderWidth: 1,
                        borderColor: isActive ? '#00cda8' : 'rgba(255,255,255,0.1)',
                        borderRadius: 24,
                        padding: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 16,
                        height: 140,
                      }}
                    >
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                        <Icon color={isActive ? '#00cda8' : '#918ea1'} size={24} />
                      </View>
                      <Text style={{ color: isActive ? '#e5e0ee' : '#918ea1', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 }}>{goal.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 4: Your Style */}
          {step === 4 && (
            <View className="flex-1 px-6">
              <View className="mb-8 items-center">
                <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: '#44eac3' }}>YOUR</Text>
                <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: '#6c5cff' }}>STYLE</Text>
                <Text style={{ color: '#c8c4d8', marginTop: 8 }}>Where do you usually work out?</Text>
              </View>

              <View className="mb-8 gap-4">
                {[
                  { id: 'gym', label: 'GYM', sub: 'Full equipment access', icon: Dumbbell },
                  { id: 'home', label: 'HOME', sub: 'Bodyweight & basics', icon: Home },
                  { id: 'outdoor', label: 'OUTDOOR', sub: 'Open space training', icon: TreePine },
                ].map(env => {
                  const isActive = workoutEnvironment === env.id;
                  const Icon = env.icon;
                  return (
                    <TouchableOpacity
                      key={env.id}
                      onPress={() => setValue('workoutEnvironment', env.id as any)}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isActive ? 'rgba(0,205,168,0.1)' : 'rgba(255,255,255,0.03)',
                        borderWidth: 1,
                        borderColor: isActive ? '#00cda8' : 'rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        padding: 16,
                      }}
                    >
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: isActive ? 'rgba(108,92,255,0.2)' : 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                        <Icon color={isActive ? '#6c5cff' : '#918ea1'} size={24} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#e5e0ee', fontSize: 18, fontWeight: '900', marginBottom: 2 }}>{env.label}</Text>
                        <Text style={{ color: '#c8c4d8', fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>{env.sub}</Text>
                      </View>
                      {isActive && <CheckCircle2 color="#44eac3" size={24} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={{ color: '#c8c4d8', fontSize: 12, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', textAlign: 'center', marginBottom: 16 }}>Workout Days / week</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                {[2,3,4,5,6,7].map(days => {
                  const isActive = workoutDays === days;
                  return (
                    <TouchableOpacity
                      key={days}
                      onPress={() => setValue('workoutDaysPerWeek', days)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 9999,
                        backgroundColor: isActive ? '#6c5cff' : 'rgba(255,255,255,0.03)',
                        borderWidth: 1,
                        borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.1)',
                        shadowColor: isActive ? '#6c5cff' : 'transparent',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isActive ? 0.4 : 0,
                        shadowRadius: 10,
                        elevation: isActive ? 5 : 0,
                      }}
                    >
                      <Text style={{ color: isActive ? '#ffffff' : '#e5e0ee', fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>{days} Days</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 5: AI Coach Ready (Loading screen) */}
          {step === 5 && (
            <View className="flex-1 px-6 items-center pt-8">
              <View className="mb-12 items-center">
                <Text style={{ fontSize: 48, fontWeight: '900', letterSpacing: -1.76, lineHeight: 52, color: 'transparent' }}>
                  <Text style={{ color: '#c5c0ff' }}>AI COACH</Text>
                </Text>
                <Text style={{ fontSize: 32, fontWeight: '900', letterSpacing: -1, lineHeight: 40, color: '#ffb68c', marginTop: 8 }}>
                  READY <Zap color="#918ea1" size={24} style={{ top: 4 }} />
                </Text>
              </View>

              <View style={{ width: 320, height: 320, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                {/* HUD Elements */}
                <Animated.View style={[{ position: 'absolute', width: 280, height: 280, borderRadius: 140, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }]} />
                <Animated.View style={[{ position: 'absolute', width: 320, height: 320, borderRadius: 160, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} />
                <Animated.View style={[{ position: 'absolute', width: 340, height: 340, borderRadius: 170, borderWidth: 2, borderColor: 'rgba(108,92,255,0.3)', borderStyle: 'dashed' }, animatedStyle]} />
                
                <Animated.View style={[{ width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(32,31,40,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }, pulseStyle]}>
                  <Image source={{ uri: BRAIN_IMG_URL }} style={{ width: 180, height: 180, opacity: 0.8 }} resizeMode="contain" />
                </Animated.View>
                
                <View style={{ position: 'absolute', top: 0, right: 20, width: 32, height: 32, borderRadius: 16, backgroundColor: '#201f28', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', elevation: 10 }}>
                  <Brain color="#c8c4d8" size={16} />
                </View>
              </View>

              <View style={{ backgroundColor: 'rgba(42,41,51,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Loader2 color="#44eac3" size={16} style={{ marginRight: 8 }} />
                <Text style={{ color: '#44eac3', fontSize: 11, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' }}>Building workout routine ...</Text>
              </View>
              <Text style={{ color: '#c8c4d8', fontSize: 16, textAlign: 'center', opacity: 0.8 }}>Optimizing your kinetic profile...</Text>
            </View>
          )}

        </ScrollView>

        {/* Fixed Bottom Action for Steps 1-4 */}
        {step < 5 && (
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 20, backgroundColor: 'rgba(19,18,28,0.9)' }}>
            <TouchableOpacity onPress={nextStep} activeOpacity={0.8} style={{ shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 }}>
              <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999 }}>
                <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#13121c', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase', marginRight: 8 }}>
                    {step === 4 ? 'Continue' : 'Next Step'}
                  </Text>
                  <ArrowRight color="#13121c" size={18} />
                </View>
              </BrandGradient>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
