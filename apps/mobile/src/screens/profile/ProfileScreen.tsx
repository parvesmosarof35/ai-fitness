import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { User, Settings, Shield, HelpCircle, LogOut, ChevronRight, Activity, Bell } from 'lucide-react-native';

const MenuOption = ({ icon: Icon, title, subtitle, onPress, destructive = false }: any) => (
  <TouchableOpacity 
    className="flex-row items-center p-4 bg-zinc-900 border-b border-zinc-800/50" 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${destructive ? 'bg-red-500/10' : 'bg-zinc-800'}`}>
      <Icon size={20} color={destructive ? '#ef4444' : '#a1a1aa'} />
    </View>
    <View className="flex-1">
      <Text className={`text-base font-medium ${destructive ? 'text-red-500' : 'text-white'}`}>{title}</Text>
      {subtitle && <Text className="text-zinc-500 text-sm mt-0.5">{subtitle}</Text>}
    </View>
    {!destructive && <ChevronRight size={20} color="#52525b" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { session, signOut } = useAuthStore();
  const userName = session?.profile?.language ? "Parves Explorer" : "Fitness Champion";
  
  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950">
      
      {/* Profile Header */}
      <View className="items-center py-10 bg-zinc-900 border-b border-zinc-800">
        <View className="w-24 h-24 bg-emerald-500/20 rounded-full items-center justify-center border-2 border-emerald-500 mb-4">
          <Text className="text-emerald-400 font-bold text-4xl">{userName.charAt(0)}</Text>
        </View>
        <Text className="text-2xl font-black text-white">{userName}</Text>
        <Text className="text-zinc-400 mt-1">Joined August 2026</Text>
        
        {/* Core Stats inside header */}
        <View className="flex-row gap-8 mt-6">
          <View className="items-center">
            <Text className="text-xl font-bold text-white">70 kg</Text>
            <Text className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Weight</Text>
          </View>
          <View className="w-px h-full bg-zinc-700" />
          <View className="items-center">
            <Text className="text-xl font-bold text-white">175 cm</Text>
            <Text className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Height</Text>
          </View>
          <View className="w-px h-full bg-zinc-700" />
          <View className="items-center">
            <Text className="text-xl font-bold text-white">12</Text>
            <Text className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Workouts</Text>
          </View>
        </View>
      </View>

      <View className="py-6">
        <Text className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Account Settings</Text>
        <MenuOption icon={User} title="Edit Profile" subtitle="Update your body metrics and goals" />
        <MenuOption icon={Activity} title="Dietary Preferences" subtitle="Manage vegan, keto, allergies" />
        <MenuOption icon={Bell} title="Notifications" />

        <Text className="px-4 text-xs font-bold text-zinc-500 uppercase tracking-wider mt-8 mb-2">App & Support</Text>
        <MenuOption icon={Settings} title="General Settings" />
        <MenuOption icon={Shield} title="Privacy & Security" />
        <MenuOption icon={HelpCircle} title="Help Center" />

        <View className="mt-8 mb-12">
          <MenuOption icon={LogOut} title="Sign Out" destructive onPress={handleSignOut} />
        </View>
      </View>
    </ScrollView>
  );
}
