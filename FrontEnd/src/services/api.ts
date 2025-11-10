import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, User, UpdateUserRequest, VerifyPasswordRequest } from '../types/index';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    const response = await api.post('/registro', data);
    return response.data;
  },

  updateUser: async (userId: number, data: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/usuario/${userId}`, data);
    return response.data;
  },

  verifyPassword: async (userId: number, data: VerifyPasswordRequest): Promise<boolean> => {
    const response = await api.post(`/usuario/${userId}/verify-password`, data);
    return response.data.valid;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/usuarios/${userId}`);
  },

  uploadProfileImage: async (userId: number, imageFile: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post(`/usuario/${userId}/imagen_perfil`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.ruta;
  }
};

export default api;