import api from '../config/api';
import { DashboardStats, RecentAppointment, MonthlyAppointment } from '../types/api';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  async getRecentAppointments(): Promise<RecentAppointment[]> {
    const response = await api.get<RecentAppointment[]>('/api/dashboard/recent-appointments');
    return response.data;
  },

  async getMonthlyAppointments(year?: number, month?: number): Promise<MonthlyAppointment[]> {
    const params = year && month ? { year, month } : {};
    const response = await api.get<MonthlyAppointment[]>('/api/dashboard/monthly', { params });
    return response.data;
  },
};
