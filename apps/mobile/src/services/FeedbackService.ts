import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FeedbackSettings = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  countdownSoundsEnabled: boolean;
  restFinishedNotificationEnabled: boolean;
  autoStartNextExercise: boolean;
};

const DEFAULT_SETTINGS: FeedbackSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  countdownSoundsEnabled: true,
  restFinishedNotificationEnabled: true,
  autoStartNextExercise: true,
};

class FeedbackService {
  private settings: FeedbackSettings = DEFAULT_SETTINGS;
  private soundCache: Record<string, Audio.Sound> = {};

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem('@feedback_settings');
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
      // Preload sounds here if we had actual audio files
      // await this.preloadSounds();
    } catch (e) {
      console.warn('Failed to load feedback settings', e);
    }
  }

  async updateSettings(newSettings: Partial<FeedbackSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    await AsyncStorage.setItem('@feedback_settings', JSON.stringify(this.settings));
  }

  getSettings() {
    return this.settings;
  }

  private async playSound(name: string) {
    if (!this.settings.soundEnabled) return;
    try {
      // If we had a real sound:
      // const sound = this.soundCache[name];
      // if (sound) await sound.replayAsync();
    } catch (e) {
      console.warn(`Failed to play sound: ${name}`, e);
    }
  }

  private triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') {
    if (!this.settings.hapticsEnabled) return;
    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (e) {
      console.warn('Failed to trigger haptic', e);
    }
  }

  setComplete() {
    this.triggerHaptic('light');
    this.playSound('success_tone');
  }

  restStarted() {
    this.triggerHaptic('medium');
    this.playSound('rest_start');
  }

  countdownTick() {
    if (!this.settings.countdownSoundsEnabled) return;
    this.triggerHaptic('light');
    this.playSound('tick');
  }

  restFinished() {
    if (!this.settings.restFinishedNotificationEnabled) return;
    this.triggerHaptic('medium');
    this.playSound('rest_finish');
  }

  workoutComplete() {
    this.triggerHaptic('success');
    this.playSound('celebration');
  }

  error() {
    this.triggerHaptic('error');
    this.playSound('error_tone');
  }

  buttonTap() {
    this.triggerHaptic('light');
    this.playSound('tap');
  }
}

export const feedback = new FeedbackService();
