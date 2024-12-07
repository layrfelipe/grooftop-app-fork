import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../services/api';
import { authService, UserProfile } from '../services/auth.service';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      initializeAuth: async () => {
        try {
          const state = await AsyncStorage.getItem('auth-storage');
          if (state) {
            const { state: persistedState } = JSON.parse(state);
            if (persistedState?.token) {
              console.log('Initializing with token:', persistedState.token);
              api.setToken(persistedState.token);
              set({ token: persistedState.token, isAuthenticated: true });
              try {
                const user = await authService.getProfile();
                set({ user });
              } catch (error) {
                console.log('Failed to get profile, logging out');
                get().logout();
              }
            }
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          get().logout();
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login({ email, password });
          console.log('Login response in store:', response);
          
          if (!response?.token) {
            throw new Error('No token received');
          }

          api.setToken(response.token);
          set({ 
            token: response.token, 
            user: response.user,
            isAuthenticated: true 
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to login' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, name: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.register({ email, name, password });
          console.log('Register response in store:', response);
          
          if (!response?.token) {
            throw new Error('No token received');
          }

          api.setToken(response.token);
          set({ 
            token: response.token,
            user: response.user,
            isAuthenticated: true 
          });
        } catch (error) {
          console.error('Register error:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to register' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        api.clearToken();
        set({ token: null, user: null, isAuthenticated: false });
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authService.updateProfile(data);
          set({ user });
        } catch (error) {
          console.error('Update profile error:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
); 