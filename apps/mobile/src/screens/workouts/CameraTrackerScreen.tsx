import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
const Camera = (props: any) => null;
const useCameraDevice = (dir: string) => null;
import { WorkoutStackParamList } from '../../navigation/types';
import { useCameraPermissions } from '../../features/camera/useCameraPermissions';
import { mockProcessFrame } from '../../features/camera/poseProcessor';

type Props = NativeStackScreenProps<WorkoutStackParamList, 'CameraTracker'>;

export default function CameraTrackerScreen({ route, navigation }: Props) {
  const { exerciseName } = route.params;
  const { hasPermission, status } = useCameraPermissions();
  const device = useCameraDevice('front');

  useEffect(() => {
    if (status === 'denied') {
      Alert.alert('Permission Denied', 'Please enable camera access in your settings to use the tracker.');
      navigation.goBack();
    }
  }, [status, navigation]);

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View className="flex-1 bg-zinc-900 items-center justify-center">
        <Text className="text-white">No camera device found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <View className="absolute top-16 left-6 right-6">
        <View className="bg-zinc-900/80 p-4 rounded-xl flex-row justify-between items-center">
          <View>
            <Text className="text-zinc-400 font-bold text-xs">TRACKING</Text>
            <Text className="text-white font-bold text-xl">{exerciseName}</Text>
          </View>
          <TouchableOpacity 
            className="bg-emerald-500 px-4 py-2 rounded-lg"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-zinc-900 font-bold">End</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-red-500/80 mt-4 p-4 rounded-xl border border-red-500">
          <Text className="text-white font-bold text-center">Lower your hips!</Text>
        </View>
      </View>

      <View className="absolute inset-0 pointer-events-none items-center justify-center">
        <View className="w-48 h-64 border-2 border-emerald-400 border-dashed rounded-3xl" />
      </View>
    </View>
  );
}
