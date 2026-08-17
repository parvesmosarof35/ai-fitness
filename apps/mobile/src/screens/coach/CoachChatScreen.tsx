import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { ArrowLeft, Sparkles, Plus, Send, Search, Bell } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BrandGradient } from '../../components/ui/BrandGradient';
import { ForgeBackground } from '../../components/ui/ForgeBackground';
import { ForgeHeader } from '../../components/ui/ForgeHeader';
import { GlassCard } from '../../components/ui/GlassCard';

type Props = { navigation: any };

const PROFILE_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBpzRq8eWqGhw_DLOWqLck5bfKLPPJXOSbYuUDkWmVHysDySmSZE5f_7yu7BUOdg5meGjrUq-AiPVw6TPCOO2zYclzCXcD4gpIZY2mS1PYpbrqIZYOre4R0sKmYacTEtsaAunOpJGmWRLOBZVngAgYUcvxQpik7mEcCTeBVFOeisieq9P6dL-3kdSAqr35ArVrMBbA-updOXRHqzkXiiillGPlUSzGh8q1J5iw6BZvO7h5oLhTyUCMG";

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Good morning, Alex. I noticed you crushed your Upper Body Strength session yesterday. How are your muscles feeling today?",
    sender: 'ai',
    time: '08:00 AM'
  },
  {
    id: '2',
    text: "Feeling a bit sore in the shoulders, but otherwise good!",
    sender: 'user',
    time: '08:02 AM'
  },
  {
    id: '3',
    text: "Perfect. We'll focus on active recovery today. I've adjusted your macros to slightly higher protein to aid muscle repair, and generated a 20-minute mobility flow.",
    sender: 'ai',
    time: '08:03 AM'
  }
];

export default function CoachChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    
    // Mock AI response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I've updated your plan based on that input. Let's keep the momentum going!",
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);
    }, 1500);
  };

  return (
    <ForgeBackground>
      <ForgeHeader onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Title Bar */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(8, 10, 16, 0.6)' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#42E8CF' }} />
          <Sparkles color="#42E8CF" size={20} />
          <Text style={{ color: '#F5F7FC', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 }}>AURA AI COACH</Text>
        </View>

        {/* Chat Messages */}
        <ScrollView 
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            
            return (
              <Animated.View 
                key={msg.id} 
                entering={FadeInUp.duration(400).delay(index * 100)}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  marginBottom: 20
                }}
              >
                {isUser ? (
                  <BrandGradient 
                    colors={['#7C6CFF', '#42E8CF'] as any} 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 1 }}
                    style={{
                      padding: 16,
                      borderRadius: 20,
                      borderBottomRightRadius: 4,
                      shadowColor: '#7C6CFF',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      elevation: 5
                    }}
                  >
                    <Text style={{ color: '#080A10', fontSize: 15, fontWeight: '600', lineHeight: 22 }}>{msg.text}</Text>
                  </BrandGradient>
                ) : (
                  <GlassCard contentStyle={{ padding: 16 }}>
                    <Text style={{ color: '#F5F7FC', fontSize: 15, fontWeight: '400', lineHeight: 22 }}>{msg.text}</Text>
                  </GlassCard>
                )}
                <Text style={{ 
                  color: '#6F7687', 
                  fontSize: 10, 
                  fontWeight: '700', 
                  marginTop: 6, 
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  letterSpacing: 0.5
                }}>
                  {msg.time}
                </Text>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View style={{ 
          position: 'absolute', 
          bottom: 0, 
          width: '100%', 
          paddingHorizontal: 24, 
          paddingTop: 12, 
          paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
          backgroundColor: 'rgba(8, 10, 16, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.08)'
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 24,
            padding: 6,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255, 255, 255, 0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <Plus color="#42E8CF" size={18} />
            </TouchableOpacity>
            
            <TextInput 
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask Aura..."
              placeholderTextColor="#A7ADBC"
              style={{ flex: 1, color: '#F5F7FC', fontSize: 15, marginHorizontal: 12 }}
              multiline
              maxLength={200}
            />

            <TouchableOpacity activeOpacity={0.8} onPress={handleSend}>
              <BrandGradient 
                colors={['#7C6CFF', '#42E8CF'] as any} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }}
                style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}
              >
                <Send color="#080A10" size={16} style={{ marginLeft: 2 }} />
              </BrandGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ForgeBackground>
  );
}
