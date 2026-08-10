import { create } from 'zustand';
import { getAccessToken, setTokens, clearTokens } from '../services/storage/secureStorage';
import { apiClient } from '../services/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

interface AuthState {
  isRestoringToken: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenIntro: boolean;
  user: User | null;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setHasSeenIntro: () => Promise<void>;
  bootstrapAsync: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isRestoringToken: true,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  hasSeenIntro: false,
  user: null,

  signIn: async (accessToken: string, refreshToken: string, user: User) => {
    await setTokens(accessToken, refreshToken);
    set({ isAuthenticated: true, hasCompletedOnboarding: user.hasCompletedOnboarding, user });
  },

  signOut: async () => {
    await clearTokens();
    set({ isAuthenticated: false, hasCompletedOnboarding: false, user: null });
  },

  completeOnboarding: async () => {
    set((state) => ({
      hasCompletedOnboarding: true,
      user: state.user ? { ...state.user, hasCompletedOnboarding: true } : null,
    }));
  },

  setHasSeenIntro: async () => {
    await AsyncStorage.setItem('hasSeenIntro', 'true');
    set({ hasSeenIntro: true });
  },

  bootstrapAsync: async () => {
    let token: string | null = null;
    let user: User | null = null;
    let hasCompletedOnboarding = false;
    let hasSeenIntro = false;

    try {
      const introStr = await AsyncStorage.getItem('hasSeenIntro');
      hasSeenIntro = introStr === 'true';

      token = await getAccessToken();
      if (token) {
        // Try fetching /me
        const response = await apiClient.get('/me');
        user = response.data.data.user;
        hasCompletedOnboarding = user?.hasCompletedOnboarding || false;
      }
    } catch (e) {
      console.error('Failed to restore token or fetch profile', e);
      token = null; 
    }

    set({
      isAuthenticated: !!token && !!user,
      isRestoringToken: false,
      hasCompletedOnboarding,
      hasSeenIntro,
      user,
    });
  },
}));
