import { api } from '../../../services/api';

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    console.log('Register response:', response);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    console.log('Login response:', response);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/me');
    console.log('Get profile response:', response);
    return response.data;
  },

  updateProfile: async (data: { name?: string; avatarUrl?: string }): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('/users/me', data);
    console.log('Update profile response:', response);
    return response.data;
  },
}; 