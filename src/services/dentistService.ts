import api from '../config/api';
import { Dentist, DentistCreate, DentistUpdate, PaginatedResponse } from '../types/api';

export const dentistService = {
  async create(data: DentistCreate): Promise<Dentist> {
    const response = await api.post<Dentist>('/api/dentists/', data);
    return response.data;
  },

  async list(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<Dentist>> {
    const response = await api.get<PaginatedResponse<Dentist>>('/api/dentists/', { params });
    return response.data;
  },

  async getById(id: string): Promise<Dentist> {
    const response = await api.get<Dentist>(`/api/dentists/${id}`);
    return response.data;
  },

  async update(id: string, data: DentistUpdate): Promise<Dentist> {
    const response = await api.put<Dentist>(`/api/dentists/${id}`, data);
    return response.data;
  },

  async delete(id: string, reason?: string): Promise<void> {
    await api.delete(`/api/dentists/${id}`, { data: { reason } });
  },
};
