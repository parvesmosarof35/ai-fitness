import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      <Text className="text-2xl font-bold text-white mb-8">Profile</Text>
      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-full"
        onPress={() => signOut()}
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
