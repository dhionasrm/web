# Integração com API - Agenda Odontológica

Este projeto foi integrado com a API do consultório odontológico.

## 🔗 Endpoints da API

**Base URL:** `http://104.234.30.22:8080`

### Autenticação
- `POST /api/auth/register` - Criar novo usuário
- `POST /api/auth/login` - Fazer login (retorna JWT token)

### Pacientes
- `POST /api/patients/` - Criar novo paciente
- `GET /api/patients/` - Listar pacientes
- `GET /api/patients/{id}` - Buscar paciente por ID
- `PUT /api/patients/{id}` - Atualizar paciente
- `DELETE /api/patients/{id}` - Deletar paciente (soft delete)

### Dentistas
- `POST /api/dentists/` - Criar novo dentista
- `GET /api/dentists/` - Listar dentistas
- `GET /api/dentists/{id}` - Buscar dentista por ID
- `PUT /api/dentists/{id}` - Atualizar dentista
- `DELETE /api/dentists/{id}` - Deletar dentista (soft delete)

### Consultas
- `POST /api/appointments/` - Criar nova consulta
- `GET /api/appointments/` - Listar consultas
- `GET /api/appointments/{id}` - Buscar consulta por ID
- `PUT /api/appointments/{id}` - Atualizar consulta
- `DELETE /api/appointments/{id}` - Cancelar consulta
- `PATCH /api/appointments/{id}/status` - Atualizar status da consulta

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do dashboard
- `GET /api/dashboard/recent-appointments` - Consultas recentes/hoje
- `GET /api/dashboard/monthly` - Consultas por mês (para calendário)

## 📁 Estrutura de Arquivos

```
src/
├── config/
│   └── api.ts                    # Configuração do Axios com interceptors
├── types/
│   └── api.ts                    # Tipos TypeScript para todos os modelos
├── services/
│   ├── authService.ts            # Serviço de autenticação
│   ├── patientService.ts         # Serviço de pacientes
│   ├── dentistService.ts         # Serviço de dentistas
│   ├── appointmentService.ts     # Serviço de consultas
│   └── dashboardService.ts       # Serviço de dashboard
└── contexts/
    └── AuthContext.tsx           # Context atualizado com API real
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:

1. O usuário faz login em `/api/auth/login` enviando username e password
2. A API retorna um `access_token` e dados do usuário
3. O token é armazenado no `localStorage`
4. Todas as requisições subsequentes incluem o token no header `Authorization: Bearer {token}`
5. Se o token expirar (erro 401), o usuário é redirecionado para a página de login

## 🛠️ Como Usar os Serviços

### Exemplo: Listar Pacientes

```typescript
import { patientService } from '@/services/patientService';

// Em um componente React
const loadPatients = async () => {
  try {
    const response = await patientService.list({
      skip: 0,
      limit: 10,
      search: 'João',
      is_active: true
    });
    console.log(response.items); // Lista de pacientes
    console.log(response.total); // Total de registros
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
  }
};
```

### Exemplo: Criar Nova Consulta

```typescript
import { appointmentService } from '@/services/appointmentService';

const createAppointment = async () => {
  try {
    const newAppointment = await appointmentService.create({
      patient_id: '123',
      dentist_id: '456',
      appointment_date: '2024-01-15T10:00:00',
      duration_minutes: 60,
      treatment_type: 'Limpeza',
      notes: 'Primeira consulta'
    });
    console.log('Consulta criada:', newAppointment);
  } catch (error) {
    console.error('Erro ao criar consulta:', error);
  }
};
```

### Exemplo: Buscar Estatísticas do Dashboard

```typescript
import { dashboardService } from '@/services/dashboardService';

const loadDashboardData = async () => {
  try {
    const stats = await dashboardService.getStats();
    console.log('Total de pacientes:', stats.total_patients);
    console.log('Consultas hoje:', stats.appointments_today);
    
    const recent = await dashboardService.getRecentAppointments();
    console.log('Consultas recentes:', recent);
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
  }
};
```

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_API_URL=http://104.234.30.22:8080
```

## 📦 Tipos TypeScript Disponíveis

Todos os tipos estão definidos em `src/types/api.ts`:

- `User`, `AuthResponse`, `LoginRequest`, `RegisterRequest`
- `Patient`, `PatientCreate`, `PatientUpdate`
- `Dentist`, `DentistCreate`, `DentistUpdate`
- `Appointment`, `AppointmentCreate`, `AppointmentUpdate`, `AppointmentStatus`
- `DashboardStats`, `RecentAppointment`, `MonthlyAppointment`
- `PaginatedResponse<T>`, `ApiError`

## 🚀 Próximos Passos

Agora você pode integrar esses serviços nos componentes da aplicação:

1. **Dashboard**: Usar `dashboardService` para mostrar estatísticas
2. **Pacientes**: Usar `patientService` para CRUD de pacientes
3. **Dentistas**: Usar `dentistService` para CRUD de dentistas
4. **Agendamentos**: Usar `appointmentService` para gerenciar consultas
5. **Calendário**: Usar `dashboardService.getMonthlyAppointments()` para popular o calendário

## 📚 Documentação Completa

Acesse a documentação completa da API em:
- **Swagger UI**: http://104.234.30.22:8080/docs
- **JSON Schema**: http://104.234.30.22:8080/docs/json
