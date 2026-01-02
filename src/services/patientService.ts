import api from '../config/api';
import { Patient, PatientCreate, PatientUpdate, PaginatedResponse } from '../types/api';

export const patientService = {
  async create(data: PatientCreate): Promise<Patient> {
    const response = await api.post<Patient>('/api/patients/', data);
    return response.data;
  },

  async list(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<PaginatedResponse<Patient>> {
    const response = await api.get<PaginatedResponse<Patient>>('/api/patients/', { params });
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await api.get<Patient>(`/api/patients/${id}`);
    return response.data;
  },

  async update(id: string, data: PatientUpdate): Promise<Patient> {
    const response = await api.put<Patient>(`/api/patients/${id}`, data);
    return response.data;
  },

  async delete(id: string, reason?: string): Promise<void> {
    await api.delete(`/api/patients/${id}`, { data: { reason } });
  },
};
