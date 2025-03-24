import { create } from 'zustand';
import { metadataService } from '../services/metadata.service';

interface Experience {
  // Add proper typing based on your data structure
  id: string;
  name: string;
  // ... other fields
}

interface MetadataState {
  experiences: any[];
  isLoading: boolean;
  error: string | null;
  fetchExperiences: () => Promise<void>;
}

const initialState = {
  experiences: [],
  isLoading: false,
  error: null,
};

export const useMetadataStore = create<MetadataState>((set) => ({
  ...initialState,

  fetchExperiences: async () => {
    try {
      set({ isLoading: true, error: null });
      const experiences = await metadataService.getExperiences();
      set({ experiences, error: null });
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch experiences',
        experiences: [] 
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
