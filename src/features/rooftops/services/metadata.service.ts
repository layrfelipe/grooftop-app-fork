import { api } from '../../../services/api';

export const metadataService = {
  getExperiences: async (): Promise<any> => {
    const response = await api.get<any>('/metadata/experience-types');
    return response.data;
  }
}; 