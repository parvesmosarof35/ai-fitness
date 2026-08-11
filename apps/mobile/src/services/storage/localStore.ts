import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  AUTH_SESSION: 'forge:auth-session:v1',
  ONBOARDING_PROFILE: 'forge:onboarding-profile:v1',
  WORKOUT_HISTORY: 'forge:workout-history:v1',
} as const;

export const localStore = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value) as T;
      }
    } catch (e) {
      console.warn(`Error reading from localStore for key ${key}:`, e);
    }
    return null;
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error writing to localStore for key ${key}:`, e);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`Error removing from localStore for key ${key}:`, e);
      return false;
    }
  },
  
  async clearAll(): Promise<boolean> {
    try {
      // Be careful not to clear things we might want to keep, but for this exercise we clear everything
      await AsyncStorage.clear();
      return true;
    } catch (e) {
      console.warn(`Error clearing localStore:`, e);
      return false;
    }
  }
};
