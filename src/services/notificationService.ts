import api from '../config/api';
import {
  NotificationTemplate,
  NotificationTemplateCreate,
  NotificationTemplateUpdate,
  NotificationLog,
  NotificationSettings,
  NotificationSettingsUpdate,
  SendNotificationRequest,
  PaginatedResponse
} from '../types/api';

export const notificationService = {
  // Templates
  async listTemplates(): Promise<NotificationTemplate[]> {
    const response = await api.get<NotificationTemplate[]>('/api/notifications/templates');
    return response.data;
  },

  async getTemplate(id: string): Promise<NotificationTemplate> {
    const response = await api.get<NotificationTemplate>(`/api/notifications/templates/${id}`);
    return response.data;
  },

  async createTemplate(data: NotificationTemplateCreate): Promise<NotificationTemplate> {
    const response = await api.post<NotificationTemplate>('/api/notifications/templates', data);
    return response.data;
  },

  async updateTemplate(id: string, data: NotificationTemplateUpdate): Promise<NotificationTemplate> {
    const response = await api.put<NotificationTemplate>(`/api/notifications/templates/${id}`, data);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/api/notifications/templates/${id}`);
  },

  // Logs de Notificações
  async listLogs(params?: {
    skip?: number;
    limit?: number;
    appointment_id?: string;
    patient_id?: string;
    status?: string;
  }): Promise<PaginatedResponse<NotificationLog>> {
    const response = await api.get<PaginatedResponse<NotificationLog>>('/api/notifications/logs', {
      params
    });
    return response.data;
  },

  async getLog(id: string): Promise<NotificationLog> {
    const response = await api.get<NotificationLog>(`/api/notifications/logs/${id}`);
    return response.data;
  },

  // Enviar Notificações
  async sendNotification(data: SendNotificationRequest): Promise<NotificationLog> {
    const response = await api.post<NotificationLog>('/api/notifications/send', data);
    return response.data;
  },

  async sendBulkNotifications(appointmentIds: string[], channel: string): Promise<{ success: number; failed: number }> {
    const response = await api.post('/api/notifications/send-bulk', {
      appointment_ids: appointmentIds,
      channel
    });
    return response.data;
  },

  // Configurações
  async getSettings(): Promise<NotificationSettings> {
    const response = await api.get<NotificationSettings>('/api/notifications/settings');
    return response.data;
  },

  async updateSettings(data: NotificationSettingsUpdate): Promise<NotificationSettings> {
    const response = await api.put<NotificationSettings>('/api/notifications/settings', data);
    return response.data;
  },

  // Testar notificação
  async testNotification(channel: string, recipient: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/api/notifications/test', {
      channel,
      recipient
    });
    return response.data;
  },

  // Notificações in-app
  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/api/notifications/in-app/unread-count');
    return response.data.count;
  },

  async getInAppNotifications(params?: {
    skip?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<PaginatedResponse<NotificationLog>> {
    const response = await api.get<PaginatedResponse<NotificationLog>>('/api/notifications/in-app', {
      params
    });
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/api/notifications/in-app/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/api/notifications/in-app/read-all');
  }
};
