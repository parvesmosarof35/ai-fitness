import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'secure_access_token';
const REFRESH_TOKEN_KEY = 'secure_refresh_token';

export const setTokens = async (accessToken: string, refreshToken: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  }
};

export const getAccessToken = async () => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  }
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  }
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const clearTokens = async () => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }
};
