import { create } from 'zustand';
import { getAccessToken, setTokens, clearTokens } from '../services/storage/secureStorage';

interface AuthState {
  isRestoringToken: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  signIn: (accessToken: string, refreshToken: string, hasCompletedOnboarding: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  bootstrapAsync: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isRestoringToken: true,
  isAuthenticated: false,
  hasCompletedOnboarding: false,

  signIn: async (accessToken: string, refreshToken: string, hasCompletedOnboarding: boolean) => {
    await setTokens(accessToken, refreshToken);
    set({ isAuthenticated: true, hasCompletedOnboarding });
  },

  signOut: async () => {
    await clearTokens();
    set({ isAuthenticated: false, hasCompletedOnboarding: false });
  },

  completeOnboarding: async () => {
    // Note: API call to save user profile would happen before this
    set({ hasCompletedOnboarding: true });
  },

  bootstrapAsync: async () => {
    let token: string | null = null;
    try {
      token = await getAccessToken();
    } catch (e) {
      console.error('Failed to restore token', e);
    }

    set({
      isAuthenticated: !!token,
      isRestoringToken: false,
      hasCompletedOnboarding: !!token, // Assume completed if we have a token, just for this bootstrap simulation
    });
  },
}));
