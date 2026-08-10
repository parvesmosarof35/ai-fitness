import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { Zap, Sparkles, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'AI FITNESS\nCOACH',
    icon: <Zap color="#fff" size={32} />,
    image: null,
  },
  {
    id: '2',
    title: 'SMART\nWORKOUTS',
    description: 'AI-powered plans that adapt to your progress in real-time.',
    image: require('../../../assets/intro/gym_1.png'),
  },
  {
    id: '3',
    title: 'PRECISION\nNUTRITION',
    description: 'Scan meals and track macros with instant AI recognition.',
    image: require('../../../assets/intro/food.png'),
    brandColor: 'text-brand-purple'
  },
  {
    id: '4',
    title: 'AI\nCOACH',
    description: 'Your 24/7 partner for motivation, form correction, and advice.',
    image: require('../../../assets/intro/gym_2.png'),
    brandColor: 'text-brand-purple'
  },
  {
    id: '5',
    title: 'TRAIN\nSMARTER',
    description: 'Your AI Personal Trainer, Nutrition Coach and Workout Partner.',
    image: require('../../../assets/intro/illustration.png'),
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
              {slide.image ? (
                <ImageBackground source={slide.image} className="flex-1 justify-end pb-32 px-8" imageStyle={{ opacity: 0.6 }}>
                  {/* Top Forge AI Logo */}
                  <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
                    <View className="px-6 py-4 flex-row justify-between items-center">
                      <Text className="text-white font-black text-xl tracking-widest">FORGE AI</Text>
                      <TouchableOpacity onPress={() => setHasSeenIntro()}>
                        <Text className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Skip</Text>
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>

                  <Text className={`text-5xl font-black mb-4 uppercase ${slide.brandColor || 'text-white'}`}>
                    {slide.title}
                  </Text>
                  {slide.description && (
                    <Text className="text-zinc-300 text-lg mb-8 max-w-[80%] leading-relaxed">
                      {slide.description.split(' ').map((word, i) => {
                        if (['AI-powered', 'instant', 'AI', '24/7', 'partner'].includes(word.replace(/[.,]/g, ''))) {
                          return <Text key={i} className="text-primary font-bold">{word} </Text>;
                        }
                        return word + ' ';
                      })}
                    </Text>
                  )}
                  
                  {/* Dots */}
                  <View className="flex-row gap-2 mb-8">
                    {SLIDES.map((_, i) => (
                      <View key={i} className={`h-1.5 rounded-full ${i === index ? 'w-8 bg-primary' : 'w-2 bg-zinc-700'}`} />
                    ))}
                  </View>

                  <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                    <BrandGradient className="py-4 rounded-full flex-row justify-center items-center">
                      <Text className="text-zinc-950 font-black text-lg mr-2 uppercase tracking-wider">
                        {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                      </Text>
                      <ArrowRight color="#09090b" size={20} strokeWidth={3} />
                    </BrandGradient>
                  </TouchableOpacity>
                </ImageBackground>
              ) : (
                <View className="flex-1 justify-center items-center px-8 relative">
                  {/* Particles / Stars placeholder */}
                  <View className="absolute inset-0 bg-background" />
                  
                  <View className="items-center z-10 mt-[-100px]">
                    <View className="mb-6">{slide.icon}</View>
                    <BrandGradient 
                      colors={['#22d3ee', '#a855f7']} 
                      start={{ x: 0, y: 0 }} 
                      end={{ x: 1, y: 1 }}
                      className="px-2 py-1 mb-2"
                      rounded={false}
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Text className="text-5xl font-black text-center text-white" style={{ opacity: 0 }}>
                        {/* We use a mask for gradient text usually, but for now we'll just style the text */}
                      </Text>
                    </BrandGradient>
                    {/* Fake gradient text since RN doesn't support text gradients easily without MaskedView */}
                    <Text className="text-5xl font-black text-center text-primary leading-tight">
                      AI{'\n'}FITNESS{'\n'}
                      <Text className="text-white">COACH</Text>
                    </Text>
                  </View>
                  <View className="absolute bottom-12">
                    <Text className="text-zinc-700 text-xs font-black tracking-[0.5em] uppercase">
                      Train Smarter With AI
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
