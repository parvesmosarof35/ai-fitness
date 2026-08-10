import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'SMART\nWORKOUTS',
    description: 'AI-powered personalized workout plans that adapt to your progress in real-time.',
    image: require('../../../assets/intro/gym_1.png'),
    brandColor: 'text-brand-cyan'
  },
  {
    id: '2',
    title: 'AI\nCOACH',
    description: 'Your 24/7 partner for motivation, form correction, and guided workout support.',
    image: require('../../../assets/intro/gym_2.png'),
    brandColor: 'text-brand-purple'
  },
  {
    id: '3',
    title: 'PRECISION\nNUTRITION',
    description: 'Scan meals, track macros, and visualize your progress with instant AI recognition.',
    image: require('../../../assets/intro/food.png'),
    brandColor: 'text-brand-orange'
  }
];

export function IntroScreen() {
  const setHasSeenIntro = useAuthStore((state) => state.setHasSeenIntro);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

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

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {SLIDES.map((slide, index) => {
          return (
            <View key={slide.id} style={{ width, height }}>
              <ImageBackground source={slide.image} className="flex-1 justify-end pb-48 px-8" imageStyle={{ opacity: 0.6 }}>
                <Text className={`text-5xl font-black mb-4 uppercase ${slide.brandColor}`}>
                  {slide.title}
                </Text>
                <Text className="text-zinc-300 text-lg mb-8 max-w-[90%] leading-relaxed">
                  {slide.description}
                </Text>
              </ImageBackground>
            </View>
          );
        })}
      </ScrollView>

      {/* Persistent Overlay Elements */}
      <SafeAreaView className="absolute inset-0 justify-between pointer-events-box-none" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        
        {/* Header: Logo & Skip */}
        <View className="px-6 py-4 flex-row justify-between items-center w-full">
          <Text className="text-white font-black text-xl tracking-widest drop-shadow-md">FORGE AI</Text>
          {activeIndex < SLIDES.length - 1 && (
            <TouchableOpacity onPress={() => setHasSeenIntro()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text className="text-zinc-300 font-bold text-xs uppercase tracking-widest drop-shadow-md bg-black/30 px-3 py-1.5 rounded-full">Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer: Dots & CTA */}
        <View className="px-8 pb-12 w-full absolute bottom-0 pointer-events-auto">
          <View className="flex-row gap-2 mb-8">
            {SLIDES.map((_, i) => (
              <View key={i} className={`h-1.5 rounded-full ${i === activeIndex ? 'w-8 bg-brand-cyan' : 'w-2 bg-zinc-700'}`} />
            ))}
          </View>

          <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
            <BrandGradient className="py-4 rounded-full flex-row justify-center items-center">
              <Text className="text-zinc-950 font-black text-lg mr-2 uppercase tracking-wider">
                {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              <ArrowRight color="#09090b" size={20} strokeWidth={3} />
            </BrandGradient>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
