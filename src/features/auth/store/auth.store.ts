import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, UserProfile } from '../services/auth.service';
import { googleAuthService } from '../services/google-auth.service';
import { api } from '../../../services/api';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        api.setToken(token);
        const user = await authService.getProfile();
        set({ isAuthenticated: true, user, token });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await AsyncStorage.removeItem('@auth_token');
      api.clearToken();
      set({ isAuthenticated: false, user: null, token: null });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authService.login({ email, password });
      await AsyncStorage.setItem('@auth_token', token);
      api.setToken(token);
      set({ isAuthenticated: true, user, token, error: null });
    } catch (error) {
      console.error('Login failed:', error);
      set({ error: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async (idToken: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await googleAuthService.loginWithGoogle(idToken);
      await AsyncStorage.setItem('@auth_token', token);
      api.setToken(token);
      set({ isAuthenticated: true, user, token, error: null });
    } catch (error) {
      console.error('Google login failed:', error);
      set({ error: error instanceof Error ? error.message : 'Google login failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email: string, name: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { token, user } = await authService.register({ email, name, password });
      await AsyncStorage.setItem('@auth_token', token);
      api.setToken(token);
      set({ isAuthenticated: true, user, token, error: null });
    } catch (error) {
      console.error('Registration failed:', error);
      set({ error: error instanceof Error ? error.message : 'Registration failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('@auth_token');
    api.clearToken();
    set({ isAuthenticated: false, user: null, token: null });
  },

  updateProfile: async (data: { name?: string; avatarUrl?: string }) => {
    try {
      set({ isLoading: true, error: null });
      const updatedUser = await authService.updateProfile(data);
      set({ user: updatedUser, error: null });
    } catch (error) {
      console.error('Profile update failed:', error);
      set({ error: error instanceof Error ? error.message : 'Profile update failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 