import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../../app/bootstrap';
import { getAccessToken, getRefreshToken, setTokens } from '../storage/secureStorage';
import { ApiError } from './errors';
import { useAuthStore } from '../../store/authStore';

import { Platform } from 'react-native';

const getBaseUrl = () => {
  // If we are strictly running in a web browser, we MUST use localhost
  // because Chrome devtools emulation (e.g. Pixel 9) will fool Platform.OS
  // into returning 'android', but the browser still needs localhost.
  if (Platform.OS === 'web' || typeof window !== 'undefined') {
    return 'http://localhost:8080/api/v1';
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api/v1';
  }
  
  if (env.EXPO_PUBLIC_API_URL) {
    return env.EXPO_PUBLIC_API_URL;
  }
  
  return 'http://localhost:8080/api/v1';
};

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  // Ensure token is safely redacted if we add console logging here later
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // NOTE: Make sure this endpoint matches the finalized backend contract later
        const res = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        await setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        // Automatically sign the user out if refresh fails
        useAuthStore.getState().signOut();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize any non-401 backend errors
    const status = error.response?.status || 500;
    const message = (error.response?.data as any)?.error || error.message || 'Unknown API Error';
    const data = error.response?.data;

    return Promise.reject(new ApiError(message, status, data));
  }
);
