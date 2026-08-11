import React from 'react';
import { View, Text, TouchableOpacity, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Mail, Lock, ExternalLink } from 'lucide-react-native';
import { AuthStackParamList } from '../../navigation/types';
import { BrandGradient } from '../../components/ui/BrandGradient';

type Props = NativeStackScreenProps<AuthStackParamList, 'CheckEmail'>;

export default function CheckEmailScreen({ navigation }: Props) {
  const openMailApp = () => {
    // In a real app, this would use Linking.openURL('message://') or similar
    console.log('Opening Mail App...');
    navigation.navigate('NewPassword' as any); // For demo purposes, auto-navigate to NewPassword
  };

  return (
    <View className="flex-1 bg-[#13121c]">
      {/* Background Decor */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: 'absolute', top: '10%', left: '20%', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(108,92,255,0.4)', transform: [{ scale: 1.5 }] }} />
        <View style={{ position: 'absolute', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(68,234,195,0.3)', transform: [{ scale: 1.5 }] }} />
      </View>

      {/* Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 40) + 20 : 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} pointerEvents="box-none">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft color="#918ea1" size={20} />
        </TouchableOpacity>
        <Text style={{ color: '#c5c0ff', fontSize: 28, fontWeight: '900', letterSpacing: -0.8 }} className="uppercase text-center">FORGE AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <View className="flex-1 items-center justify-center px-6 w-full max-w-md mx-auto">
        <View style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 32, width: '100%', alignItems: 'center' }} className="shadow-2xl">
          
          <View style={{ backgroundColor: '#201f28', borderRadius: 9999, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <Mail color="#44eac3" size={48} />
          </View>
          
          <Text style={{ fontSize: 40, fontWeight: '900', letterSpacing: -1, lineHeight: 44, color: '#ffffff', textAlign: 'center', marginBottom: 16 }}>
            CHECK <Text style={{ color: '#c5c0ff' }}>EMAIL</Text>
          </Text>
          
          <Text style={{ color: '#c8c4d8', fontSize: 16, textAlign: 'center', marginBottom: 32 }}>
            We sent a magic link to your inbox. Tap it to get back in the game.
          </Text>

          <TouchableOpacity onPress={openMailApp} activeOpacity={0.8} style={{ width: '100%', shadowColor: '#6c5cff', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8, marginBottom: 24 }}>
            <BrandGradient colors={['#6c5cff', '#44eac3'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 9999 }}>
              <View style={{ paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ExternalLink color="#13121c" size={18} style={{ marginRight: 8 }} />
                <Text style={{ color: '#13121c', fontSize: 14, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' }}>
                  OPEN MAIL APP
                </Text>
              </View>
            </BrandGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log('Resending email...')}>
            <Text style={{ color: '#44eac3', fontSize: 14, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', textDecorationLine: 'underline' }}>
              RESEND EMAIL
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }} pointerEvents="box-none">
        <View style={{ backgroundColor: '#2a2933', borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
          <Lock color="#44eac3" size={14} style={{ marginRight: 8 }} />
          <Text style={{ color: '#44eac3', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' }}>KINETIC AI ENCRYPTION ACTIVE</Text>
        </View>
      </View>

    </View>
  );
}
