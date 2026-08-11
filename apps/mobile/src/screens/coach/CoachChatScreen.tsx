import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { ArrowLeft, Sparkles, Plus, Send, Search, Bell } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BrandGradient } from '../../components/ui/BrandGradient';

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
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#13121c' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Orbs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: 200, backgroundColor: 'rgba(108,92,255,0.15)', filter: 'blur(100px)' }} />
        <View style={{ position: 'absolute', bottom: 100, right: -50, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(68,234,195,0.15)', filter: 'blur(100px)' }} />
      </View>

      {/* Top App Bar */}
      <View style={{ paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(19,18,28,0.8)', zIndex: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <ArrowLeft color="#c8c4d8" size={24} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Sparkles color="#44eac3" size={24} />
            <Text style={{ color: '#e5e0ee', fontSize: 18, fontWeight: '900', fontStyle: 'italic', letterSpacing: -0.5 }}>AURA</Text>
          </View>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity activeOpacity={0.7}>
            <Search color="#c8c4d8" size={24} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <View>
              <Bell color="#c8c4d8" size={24} />
              <View style={{ position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#44eac3' }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <View style={{ width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(68,234,195,0.3)' }}>
              <Image source={{ uri: PROFILE_IMG }} style={{ width: '100%', height: '100%' }} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 120 }}
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
                marginBottom: 24
              }}
            >
              {isUser ? (
                <BrandGradient 
                  colors={['#6c5cff', '#44eac3'] as any} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 16,
                    borderRadius: 24,
                    borderBottomRightRadius: 4,
                    shadowColor: '#6c5cff',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5
                  }}
                >
                  <Text style={{ color: '#13121c', fontSize: 16, fontWeight: '500', lineHeight: 24 }}>{msg.text}</Text>
                </BrandGradient>
              ) : (
                <View style={{
                  backgroundColor: 'rgba(53,52,62,0.6)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)',
                  padding: 16,
                  borderRadius: 24,
                  borderBottomLeftRadius: 4
                }}>
                  <Text style={{ color: '#e5e0ee', fontSize: 16, fontWeight: '400', lineHeight: 24 }}>{msg.text}</Text>
                </View>
              )}
              <Text style={{ 
                color: '#918ea1', 
                fontSize: 10, 
                fontWeight: '700', 
                marginTop: 8, 
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                textTransform: 'uppercase'
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
        paddingTop: 16, 
        paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
        backgroundColor: 'rgba(19,18,28,0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)'
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(53,52,62,0.8)',
          borderRadius: 32,
          padding: 8,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)'
        }}>
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#201f28', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Plus color="#44eac3" size={20} />
          </TouchableOpacity>
          
          <TextInput 
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask AURA..."
            placeholderTextColor="#918ea1"
            style={{ flex: 1, color: '#ffffff', fontSize: 16, marginHorizontal: 12 }}
            multiline
            maxLength={200}
          />

          <TouchableOpacity activeOpacity={0.8} onPress={handleSend}>
            <BrandGradient 
              colors={['#6c5cff', '#44eac3'] as any} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }}
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            >
              <Send color="#13121c" size={18} style={{ marginLeft: 2 }} />
            </BrandGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
