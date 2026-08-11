import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react-native';
import { BrandGradient } from '../../components/ui/BrandGradient';

const { width, height } = Dimensions.get('window');

type SlideData = {
  id: string;
  type: 'splash' | 'content';
  titleLine1?: string;
  titleLine2?: string;
  titleColor1?: string;
  titleColor2?: string;
  description?: string;
  highlightText?: string;
  highlightColor?: string;
  image?: any;
  btnText?: string;
};

const SLIDES: SlideData[] = [
  {
    id: 'splash',
    type: 'splash',
  },
  {
    id: 'smart-workouts',
    type: 'content',
    titleLine1: 'SMART',
    titleLine2: 'WORKOUTS',
    titleColor1: '#ffaa77',
    titleColor2: '#55ffcc',
    description: 'AI-powered plans that adapt to your progress in real-time.',
    highlightText: 'AI-powered',
    highlightColor: '#55ffcc',
    image: require('../../../assets/intro/gym_1.png'),
    btnText: 'NEXT',
  },
  {
    id: 'precision-nutrition',
    type: 'content',
    titleLine1: 'PRECISION',
    titleLine2: 'NUTRITION',
    titleColor1: '#7b61ff',
    titleColor2: '#f8965f',
    description: 'Scan meals and track macros with instant AI recognition.',
    highlightText: 'instant AI recognition',
    highlightColor: '#5eead4',
    image: require('../../../assets/intro/food.png'),
    btnText: 'NEXT',
  },
  {
    id: 'ai-coach',
    type: 'content',
    titleLine1: 'AI',
    titleLine2: 'COACH',
    titleColor1: '#00f2fe',
    titleColor2: '#667eea',
    description: 'Your 24/7 partner for motivation, form correction, and advice.',
    highlightText: '24/7 partner',
    highlightColor: '#00f2fe',
    image: require('../../../assets/intro/gym_2.png'),
    btnText: 'NEXT',
  },
  {
    id: 'get-started',
    type: 'content',
    titleLine1: 'TRAIN',
    titleLine2: 'SMARTER',
    titleColor1: '#3b82f6', 
    titleColor2: '#fb923c', 
    description: 'Your AI Personal Trainer, Nutrition Coach and Workout Partner.',
    image: require('../../../assets/intro/gym_1.png'), 
    btnText: 'GET STARTED',
  }
];

export function IntroScreen() {
  const setHasSeenIntro = useAuthStore((state) => state.setHasSeenIntro);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-advance splash screen
  useEffect(() => {
    if (activeIndex === 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeIndex]);

  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / width));
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      setHasSeenIntro();
    }
  };

  const getBtnColor = (index: number): string => {
    switch(index) {
      case 1: return '#7b61ff';
      case 2: return '#5eead4';
      case 3: return '#667eea';
      case 4: return '#06b6d4';
      default: return '#3b82f6';
    }
  };

  const renderSlide = (slide: SlideData, index: number) => {
    if (slide.type === 'splash') {
      return (
        <View key={slide.id} style={{ width, height }} className="bg-[#0F111A] flex-1 justify-center items-center relative">
          <View className="mb-4 shadow-[0_0_15px_rgba(197,192,255,0.6)]">
            <Zap color="#C4B5FD" size={48} fill="#C4B5FD" />
          </View>
          <View className="items-center">
            <Text style={{ textShadowColor: 'rgba(108, 92, 255, 0.5)', textShadowRadius: 30 }} className="text-[#7B61FF] text-5xl font-black uppercase tracking-tight">AI</Text>
            <Text style={{ textShadowColor: 'rgba(255, 154, 90, 0.4)', textShadowRadius: 30 }} className="text-[#FF9966] text-5xl font-black uppercase tracking-tight -mt-1">Fitness</Text>
            <Text className="text-white text-5xl font-black uppercase tracking-tight -mt-1">Coach</Text>
          </View>
          <View className="absolute bottom-12 w-full items-center">
            <Text style={{ letterSpacing: 2.4 }} className="text-[10px] uppercase text-zinc-500 font-bold">
              Train Smarter With AI
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={slide.id} style={{ width, height }} className="bg-zinc-900">
        <ImageBackground source={slide.image} className="absolute inset-0" imageStyle={{ opacity: 0.6 }} />
        <View
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)' }}
          className="absolute inset-0"
        />
        
        <View className="flex-1 justify-end px-8 pb-32 z-10">
          <View className="mb-4">
            <Text style={{ color: slide.titleColor1 }} className="text-5xl font-black uppercase leading-none tracking-tight">
              {slide.titleLine1}
            </Text>
            <Text style={{ color: slide.titleColor2 }} className="text-5xl font-black uppercase leading-none tracking-tight">
              {slide.titleLine2}
            </Text>
          </View>

          <Text className="text-zinc-300 text-sm leading-relaxed mb-8 pr-4">
            {slide.description?.split(slide.highlightText || '').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                  <Text style={{ color: slide.highlightColor }} className="font-semibold">
                    {slide.highlightText}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#18181b]">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {SLIDES.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Header: Logo & Skip */}
      {activeIndex > 0 && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 40) + 20 : 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} pointerEvents="box-none">
          <Text style={{ color: '#E3E1E9', fontSize: 28, fontWeight: '900', letterSpacing: -1.2 }} className="uppercase drop-shadow-md">FORGE AI</Text>
          {activeIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => setHasSeenIntro()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ color: '#C8C4D8', letterSpacing: 2.4, fontSize: 12, fontWeight: 'bold' }} className="uppercase">SKIP</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Footer: Dots & CTA */}
      {activeIndex > 0 && (
        <View style={{ position: 'absolute', bottom: 48, left: 0, right: 0, zIndex: 50, paddingHorizontal: 32 }} pointerEvents="box-none">
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32, alignItems: 'center', height: 6 }}>
            {SLIDES.slice(1).map((_, i) => {
              const currentDataIndex = i + 1;
              const isActive = currentDataIndex === activeIndex;
              if (isActive) {
                return (
                  <View key={i} style={{ height: 6, width: 48, borderRadius: 9999, overflow: 'hidden' }}>
                    <BrandGradient colors={['#6C5CFF', '#5FFFD7'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
                  </View>
                )
              }
              return (
                <View key={i} style={{ height: 6, width: 24, borderRadius: 9999, backgroundColor: '#34343A', opacity: 0.5 }} />
              )
            })}
          </View>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.8} style={{ shadowColor: '#6C5CFF', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 10 }}>
            <BrandGradient
              colors={['#6C5CFF', '#5FFFD7'] as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 9999 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 32 }}>
                <Text style={{ letterSpacing: 3.6, color: '#ffffff', fontWeight: 'bold', fontSize: 16, marginRight: 8 }} className="uppercase">
                  {SLIDES[activeIndex].btnText}
                </Text>
                <ArrowRight color="#ffffff" size={20} strokeWidth={2.5} />
              </View>
            </BrandGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
