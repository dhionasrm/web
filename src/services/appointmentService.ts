import api from '../config/api';
import { 
  Appointment, 
  AppointmentCreate, 
  AppointmentUpdate,
  AppointmentStatusUpdate,
  PaginatedResponse 
} from '../types/api';

export const appointmentService = {
  async create(data: AppointmentCreate): Promise<Appointment> {
    const response = await api.post<Appointment>('/api/appointments/', data);
    return response.data;
  },

  async list(params?: {
    skip?: number;
    limit?: number;
    patient_id?: string;
    dentist_id?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    const response = await api.get<PaginatedResponse<Appointment>>('/api/appointments/', { params });
    return response.data;
  },

  async getById(id: string): Promise<Appointment> {
    const response = await api.get<Appointment>(`/api/appointments/${id}`);
    return response.data;
  },

  async update(id: string, data: AppointmentUpdate): Promise<Appointment> {
    const response = await api.put<Appointment>(`/api/appointments/${id}`, data);
    return response.data;
  },

  async updateStatus(id: string, data: AppointmentStatusUpdate): Promise<Appointment> {
    const response = await api.patch<Appointment>(`/api/appointments/${id}/status`, data);
    return response.data;
  },

  async cancel(id: string, reason?: string): Promise<void> {
    await api.delete(`/api/appointments/${id}`, { data: { reason } });
  },
};
