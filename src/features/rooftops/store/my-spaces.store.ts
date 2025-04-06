import { create } from 'zustand';
import { api } from '../../../services/api';
import { Rooftop } from '../types/rooftop.types';
import { authService } from '../../auth/services/auth.service';

interface MeResponse {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
  rooftops: Rooftop[];
}

interface MySpacesState {
  spaces: Rooftop[];
  isLoading: boolean;
  error: string | null;
  fetchMySpaces: () => Promise<void>;
}

export const useMySpacesStore = create<MySpacesState>((set) => ({
  spaces: [],
  isLoading: false,
  error: null,

  fetchMySpaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getProfile();
      set({ spaces: response.rooftops, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch my spaces:', error);
      set({ error: error.message || 'Failed to fetch your spaces', isLoading: false });
    }
  },
})); 