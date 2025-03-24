import { api } from '../../../services/api';
import { Rooftop, CreateRooftopDto, UpdateRooftopDto, RooftopFilters } from '../types/rooftop.types';

const DEFAULT_COORDINATES = {
  latitude: -22.9068,  // Rio de Janeiro coordinates
  longitude: -43.1729,
  radius: 1000
};

export const rooftopService = {
  getRooftops: async (filters?: RooftopFilters): Promise<Rooftop[]> => {
    const params = new URLSearchParams();
    if (filters?.city) params.append('city', filters.city);
    if (filters?.capacity) params.append('capacity', filters.capacity.toString());

    const response = await api.get<Rooftop[]>(`/rooftops${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getRooftop: async (id: string): Promise<Rooftop> => {
    const response = await api.get<Rooftop>(`/rooftops/${id}`);
    return response.data;
  },

  createRooftop: async (data: CreateRooftopDto): Promise<Rooftop> => {
    const response = await api.post<Rooftop>('/rooftops', data);
    return response.data;
  },

  updateRooftop: async (id: string, data: UpdateRooftopDto): Promise<Rooftop> => {
    const response = await api.patch<Rooftop>(`/rooftops/${id}`, data);
    return response.data;
  },

  deleteRooftop: async (id: string): Promise<void> => {
    await api.delete(`/rooftops/${id}`);
  },

  async getNearbyRooftops() {
    try {
      const params = new URLSearchParams({
        latitude: DEFAULT_COORDINATES.latitude.toString(),
        longitude: DEFAULT_COORDINATES.longitude.toString(),
        radius: DEFAULT_COORDINATES.radius.toString(),
      });

      const response = await api.get(`/rooftops/nearby?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby rooftops:', error);
      throw error;
    }
  },

  async getRecommendedRooftops() {
    try {
      const response = await api.get('/rooftops/recommended');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended rooftops:', error);
      throw error;
    }
  }
}; 