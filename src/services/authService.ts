import api from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email: credentials.email,
      senha: credentials.senha,
    });
    
    // Salva o token no localStorage
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ nome: response.data.nome, perfil: response.data.perfil }));
    }
    
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    
    // Salva o token no localStorage
    if (response.data.token) {
      localStorage.setItem('access_token', response.data.token);
      localStorage.setItem('user', JSON.stringify({ nome: response.data.nome, perfil: response.data.perfil }));
    }
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  },

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },

  async forgotPassword(email: string): Promise<void> {
    // Endpoint de recuperação de senha - ajuste se a API usar outro path
    await api.post('/api/auth/forgot-password', { email });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Endpoint para alteração de senha autenticada
    await api.post('/api/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },
};
