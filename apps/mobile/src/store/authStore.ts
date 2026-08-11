import { create } from 'zustand';
import { localStore, StorageKeys } from '../services/storage/localStore';

export interface User {
  id: string;
  email: string;
  hasCompletedOnboarding: boolean;
}

interface AuthSession {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenIntro: boolean;
  user: User | null;
}

interface AuthState extends AuthSession {
  isRestoringToken: boolean;
  isSigningOut: boolean;
  authGeneration: number;
  signIn: (user: User) => Promise<void>;
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

  signIn: async (user: User) => {
    const newState = {
      isAuthenticated: true,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      hasSeenIntro: get().hasSeenIntro,
      user,
    };
    await localStore.setItem<AuthSession>(StorageKeys.AUTH_SESSION, newState);
    set((state) => ({ 
      ...newState,
      authGeneration: state.authGeneration + 1
    }));
  },

  signOut: async () => {
    set((state) => ({ 
      isAuthenticated: false, 
      isSigningOut: true,
      hasCompletedOnboarding: false, 
      user: null,
      authGeneration: state.authGeneration + 1 
    }));

    try {
      await localStore.removeItem(StorageKeys.AUTH_SESSION);
    } catch (e) {
      console.error('Failed to clear local session', e);
    } finally {
      set({ isSigningOut: false });
    }
  },

  completeOnboarding: async () => {
    const state = get();
    const updatedUser = state.user ? { ...state.user, hasCompletedOnboarding: true } : null;
    
    const newState = {
      isAuthenticated: state.isAuthenticated,
      hasCompletedOnboarding: true,
      hasSeenIntro: state.hasSeenIntro,
      user: updatedUser,
    };

    await localStore.setItem<AuthSession>(StorageKeys.AUTH_SESSION, newState);

    set({
      hasCompletedOnboarding: true,
      user: updatedUser,
    });
  },

  setHasSeenIntro: async () => {
    const state = get();
    const newState = {
      isAuthenticated: state.isAuthenticated,
      hasCompletedOnboarding: state.hasCompletedOnboarding,
      hasSeenIntro: true,
      user: state.user,
    };
    
    await localStore.setItem<AuthSession>(StorageKeys.AUTH_SESSION, newState);
    set({ hasSeenIntro: true });
  },

  bootstrapAsync: async () => {
    try {
      const session = await localStore.getItem<AuthSession>(StorageKeys.AUTH_SESSION);
      
      if (session) {
        set({
          isAuthenticated: session.isAuthenticated,
          hasCompletedOnboarding: session.hasCompletedOnboarding,
          hasSeenIntro: session.hasSeenIntro,
          user: session.user,
          isRestoringToken: false,
        });
        return;
      }
    } catch (e) {
      console.error('Failed to restore session', e);
    }

    set({
      isAuthenticated: false,
      isRestoringToken: false,
      hasCompletedOnboarding: false,
      hasSeenIntro: false,
      user: null,
    });
  },
}));
