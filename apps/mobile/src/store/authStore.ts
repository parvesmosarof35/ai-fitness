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
  isSigningOut: boolean;
  authGeneration: number;
  hasCompletedOnboarding: boolean;
  hasSeenIntro: boolean;
  user: User | null;
  signIn: (accessToken: string, refreshToken: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  setHasSeenIntro: () => Promise<void>;
  bootstrapAsync: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isRestoringToken: true,
  isAuthenticated: false,
  isSigningOut: false,
  authGeneration: 0,
  hasCompletedOnboarding: false,
  hasSeenIntro: false,
  user: null,

  signIn: async (accessToken: string, refreshToken: string, user: User) => {
    await setTokens(accessToken, refreshToken);
    set((state) => ({ 
      isAuthenticated: true, 
      hasCompletedOnboarding: user.hasCompletedOnboarding, 
      user,
      authGeneration: state.authGeneration + 1
    }));
  },

  signOut: async () => {
    // 1. Immediately mark user unauthenticated so UI transitions out
    set((state) => ({ 
      isAuthenticated: false, 
      isSigningOut: true,
      hasCompletedOnboarding: false, 
      user: null,
      authGeneration: state.authGeneration + 1 
    }));

    try {
      // 2. Best-effort backend revocation
      await apiClient.post('/auth/logout').catch(() => {
        // Ignore backend failures (user might be offline)
      });
    } finally {
      // 3. Clear local storage regardless of backend success
      try {
        await clearTokens();
      } catch (e) {
        console.error('Failed to clear secure tokens', e);
      }
      set({ isSigningOut: false });
    }
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
