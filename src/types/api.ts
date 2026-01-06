// Tipos base
export type UserProfile = 'admin' | 'atendente' | 'dentista';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  perfil: UserProfile;
}

export interface AuthResponse {
  token: string;
  nome: string;
  perfil: UserProfile;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: UserProfile;
}

// Pacientes
export interface Patient {
  id: string;
  nome: string;
  cpf?: string;
  email?: string;
  telefone: string;
  tipoAtendimento?: string;
  dataNascimento?: string;
  observacoes?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PatientCreate {
  nome: string;
  tipoAtendimento?: string;
  email?: string;
  telefone: string;
  dataNascimento?: string;
  observacoes?: string;
}

export interface PatientUpdate {
  nome?: string;
  tipoAtendimento?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  observacoes?: string;
}

// Dentistas
export interface Dentist {
  id: string;
  nome: string;
  cro: string;
  especialidade?: string;
  telefone: string;
  email?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface DentistCreate {
  nome: string;
  cro: string;
  especialidade?: string;
  telefone: string;
  email?: string;
}

export interface DentistUpdate {
  nome?: string;
  cro?: string;
  especialidade?: string;
  telefone?: string;
  email?: string;
}

// Consultas
export type AppointmentStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show';

export interface Appointment {
  id: string;
  patient_id: string;
  dentist_id: string;
  appointment_date: string;
  duration_minutes: number;
  status: AppointmentStatus;
  notes?: string;
  treatment_type?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  dentist?: Dentist;
}

export interface AppointmentCreate {
  patient_id: string;
  dentist_id: string;
  appointment_date: string;
  duration_minutes: number;
  notes?: string;
  treatment_type?: string;
}

export interface AppointmentUpdate {
  patient_id?: string;
  dentist_id?: string;
  appointment_date?: string;
  duration_minutes?: number;
  status?: AppointmentStatus;
  notes?: string;
  treatment_type?: string;
}

export interface AppointmentStatusUpdate {
  status: AppointmentStatus;
}

// Dashboard
export interface DashboardStats {
  total_patients: number;
  total_dentists: number;
  total_appointments: number;
  appointments_today: number;
  appointments_this_week: number;
  appointments_this_month: number;
}

export interface RecentAppointment {
  id: string;
  patient_name: string;
  dentist_name: string;
  appointment_date: string;
  status: AppointmentStatus;
  treatment_type?: string;
}

export interface MonthlyAppointment {
  date: string;
  count: number;
  appointments: Array<{
    id: string;
    patient_name: string;
    dentist_name: string;
    time: string;
    status: AppointmentStatus;
  }>;
}

// Paginação e Filtros
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
}

// Notificações
export type NotificationChannel = 'whatsapp' | 'sms' | 'email' | 'in_app';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'delivered' | 'read';
export type NotificationTrigger = 'manual' | '24h_before' | '2h_before' | 'on_confirm' | 'on_cancel';

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  trigger: NotificationTrigger;
  subject?: string;
  message: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplateCreate {
  name: string;
  channel: NotificationChannel;
  trigger: NotificationTrigger;
  subject?: string;
  message: string;
  is_active?: boolean;
}

export interface NotificationTemplateUpdate {
  name?: string;
  channel?: NotificationChannel;
  trigger?: NotificationTrigger;
  subject?: string;
  message?: string;
  is_active?: boolean;
}

export interface NotificationLog {
  id: string;
  appointment_id: string;
  patient_id: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  message: string;
  status: NotificationStatus;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
  created_at: string;
  appointment?: Appointment;
  patient?: Patient;
}

export interface NotificationSettings {
  id: string;
  whatsapp_enabled: boolean;
  whatsapp_api_key?: string;
  whatsapp_phone?: string;
  sms_enabled: boolean;
  sms_api_key?: string;
  sms_sender?: string;
  email_enabled: boolean;
  email_smtp_host?: string;
  email_smtp_port?: number;
  email_sender?: string;
  notification_24h_enabled: boolean;
  notification_2h_enabled: boolean;
  notification_on_confirm_enabled: boolean;
  updated_at: string;
}

export interface NotificationSettingsUpdate {
  whatsapp_enabled?: boolean;
  whatsapp_api_key?: string;
  whatsapp_phone?: string;
  sms_enabled?: boolean;
  sms_api_key?: string;
  sms_sender?: string;
  email_enabled?: boolean;
  email_smtp_host?: string;
  email_smtp_port?: number;
  email_sender?: string;
  notification_24h_enabled?: boolean;
  notification_2h_enabled?: boolean;
  notification_on_confirm_enabled?: boolean;
}

export interface SendNotificationRequest {
  appointment_id: string;
  channel: NotificationChannel;
  template_id?: string;
  custom_message?: string;
}
