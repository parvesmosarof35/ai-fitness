import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/types';
import { useCameraPermissions } from '../../features/camera/useCameraPermissions';
import { mockProcessFrame } from '../../features/camera/poseProcessor';
import { StateView } from '../../components/ui/StateView';
import { GlassCard } from '../../components/ui/GlassCard';
const Camera = (props: any) => null;
const useCameraDevice = (dir: string) => null;

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
      <StateView
        type="permission"
        title="Camera Access Needed"
        description="Please grant camera permission to use AI form tracking."
        actionLabel="Go Back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  if (device == null) {
    return (
      <StateView
        type="error"
        title="Camera Unavailable"
        description="No active camera device was detected on your hardware."
        actionLabel="Go Back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#080A10' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />

      <View style={{ position: 'absolute', top: 60, left: 24, right: 24 }}>
        <GlassCard contentStyle={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
          <View>
            <Text style={{ color: '#6F7687', fontWeight: '800', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>AI POSE TRACKER</Text>
            <Text style={{ color: '#F5F7FC', fontWeight: '900', fontSize: 20 }}>{exerciseName}</Text>
          </View>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF6B78', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 }}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#F5F7FC', fontWeight: '800', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>End</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={{ backgroundColor: 'rgba(255, 107, 120, 0.15)', marginTop: 12, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 107, 120, 0.3)' }}>
          <Text style={{ color: '#FF6B78', fontWeight: '800', textAlign: 'center', fontSize: 13, letterSpacing: 0.5 }}>Lower your hips for optimal depth!</Text>
        </View>
      </View>

      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, pointerEvents: 'none', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 220, height: 320, borderWidth: 2, borderColor: '#42E8CF', borderStyle: 'dashed', borderRadius: 32 }} />
      </View>
    </View>
  );
}
