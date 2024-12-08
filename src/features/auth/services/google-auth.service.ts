import { api } from '../../../services/api';
import { AuthResponse } from './auth.service';

export const googleAuthService = {
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', { idToken });
    return response.data;
  },
}; 