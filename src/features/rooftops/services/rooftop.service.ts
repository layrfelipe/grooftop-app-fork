import { api } from '../../../services/api';
import { Rooftop, CreateRooftopDto, UpdateRooftopDto, RooftopFilters } from '../types/rooftop.types';

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
}; 