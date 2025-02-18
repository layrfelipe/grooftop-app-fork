import { create } from 'zustand';
import { rooftopService } from '../services/rooftop.service';
import { Rooftop, RooftopFilters } from '../types/rooftop.types';

interface RooftopState {
  // rooftops: Rooftop[];
  rooftops: any[];

  isLoading: boolean;
  error: string | null;
  filters: RooftopFilters;
  fetchRooftops: (filters?: RooftopFilters) => Promise<void>;
  setFilters: (filters: RooftopFilters) => void;
  clearFilters: () => void;
}

const initialState = {
  rooftops: [],
  isLoading: false,
  error: null,
  filters: {},
};

export const useRooftopStore = create<RooftopState>((set, get) => ({
  ...initialState,

  fetchRooftops: async (filters?: RooftopFilters) => {
    try {
      set({ isLoading: true, error: null });
      const rooftops = await rooftopService.getRooftops(filters || get().filters);
      set({ rooftops, error: null });
    } catch (error) {
      console.error('Failed to fetch rooftops:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch rooftops',
        rooftops: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (filters: RooftopFilters) => {
    set({ filters });
    get().fetchRooftops(filters);
  },

  clearFilters: () => {
    set({ filters: {} });
    get().fetchRooftops({});
  },
})); 