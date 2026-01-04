import { z } from 'zod';

// Schema para criação de paciente
export const patientSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  telefone: z.string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .max(15, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, 'Formato de telefone inválido'),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
  
  dataNascimento: z.string()
    .optional()
    .or(z.literal('')),
  
  tipoAtendimento: z.string()
    .optional()
    .or(z.literal('')),
  
  observacoes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// Schema para criação de dentista
export const dentistSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  
  cro: z.string()
    .min(3, 'CRO deve ter no mínimo 3 caracteres')
    .max(20, 'CRO inválido'),
  
  especialidade: z.string()
    .max(100, 'Especialidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefone: z.string()
    .min(10, 'Telefone deve ter no mínimo 10 dígitos')
    .max(15, 'Telefone inválido')
    .regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$|^\d{10,11}$/, 'Formato de telefone inválido'),
  
  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),
});

export type DentistFormData = z.infer<typeof dentistSchema>;

// Schema para criação de consulta
export const appointmentSchema = z.object({
  patient_id: z.string()
    .min(1, 'Selecione um paciente'),
  
  dentist_id: z.string()
    .min(1, 'Selecione um dentista'),
  
  appointment_date: z.string()
    .min(1, 'Selecione uma data e hora')
    .refine((date) => {
      const selectedDate = new Date(date);
      const now = new Date();
      return selectedDate > now;
    }, 'Data deve ser futura'),
  
  duration_minutes: z.number()
    .min(15, 'Duração mínima de 15 minutos')
    .max(480, 'Duração máxima de 8 horas'),
  
  treatment_type: z.string()
    .max(100, 'Tipo de tratamento deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
