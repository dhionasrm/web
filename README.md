# 🦷 Agenda Odontológica - Frontend

Sistema web de gestão para consultórios odontológicos, com agendamento de consultas, cadastro de pacientes e dentistas, e dashboard analítico.

## 🚀 Começando

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.0.0 (ou Node.js >= 18.0.0)
- Git

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd agenda_web
```

2. Instale as dependências:
```bash
bun install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
VITE_API_URL=http://104.234.30.22:8080
NODE_ENV=development
```

4. Execute o projeto em modo desenvolvimento:
```bash
bun run dev
```

5. Acesse em: [http://localhost:5173](http://localhost:5173)

## 📦 Scripts Disponíveis

```bash
bun run dev          # Inicia o servidor de desenvolvimento
bun run build        # Gera build de produção
bun run build:dev    # Gera build de desenvolvimento
bun run preview      # Visualiza o build de produção
bun run lint         # Executa o linter
```

## 🏗️ Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas
- **Shadcn/ui** - Componentes UI
- **Tailwind CSS** - Framework CSS
- **date-fns** - Manipulação de datas
- **Sonner** - Notificações toast

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base do shadcn/ui
│   ├── AppSidebar.tsx  # Menu lateral
│   ├── DashboardLayout.tsx
│   ├── ErrorBoundary.tsx
│   ├── Pagination.tsx
│   ├── ProtectedRoute.tsx
│   ├── NovaConsulta.tsx
│   ├── NovoDentista.tsx
│   └── NovoPaciente.tsx
├── config/
│   └── api.ts          # Configuração do Axios
├── contexts/
│   └── AuthContext.tsx # Context de autenticação
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-plans.ts
│   └── use-toast.ts
├── lib/
│   └── utils.ts        # Funções utilitárias
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Agendamentos.tsx
│   ├── Pacientes.tsx
│   ├── Doutores.tsx
│   ├── Calendario.tsx
│   ├── Configuracoes.tsx
│   ├── Suporte.tsx
│   ├── Login.tsx
│   ├── ResetPassword.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── schemas/
│   └── forms.ts        # Schemas de validação Zod
├── services/           # Serviços de API
│   ├── authService.ts
│   ├── patientService.ts
│   ├── dentistService.ts
│   ├── appointmentService.ts
│   └── dashboardService.ts
└── types/
    └── api.ts          # Tipos TypeScript

```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token):
- Token armazenado no `localStorage`
- Interceptor Axios adiciona token em todas as requisições
- Redirecionamento automático ao expirar sessão
- Rotas protegidas com `ProtectedRoute`

## ✨ Funcionalidades Principais

### Dashboard
- Estatísticas em tempo real (consultas, pacientes, dentistas)
- Lista de consultas do dia
- Cards interativos com animações

### Agendamentos
- Lista paginada de consultas
- Busca server-side por paciente/dentista
- Filtros avançados (status, data)
- Criação e cancelamento de consultas
- Validação Zod em formulários

### Pacientes
- CRUD completo com paginação
- Busca server-side
- Validação de campos (telefone, email, CPF)
- Tipo de atendimento (planos customizáveis)

### Dentistas
- Cadastro com CRO e especialidade
- Lista paginada com busca
- Gerenciamento de informações

### Calendário
- Visualização mensal de consultas
- Integração com API dashboard
- Navegação entre meses
- Contador de consultas por dia

### Configurações
- Alteração de senha (com requisitos de segurança)
- Gerenciador de planos de atendimento
- Persistência em localStorage

## 🔄 Integração com API

Base URL configurável via `.env`:
```
VITE_API_URL=http://104.234.30.22:8080
```

### Endpoints Principais

**Autenticação**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/forgot-password` - Recuperar senha
- `POST /api/auth/change-password` - Alterar senha

**Pacientes**
- `GET /api/patients/` - Listar (paginado)
- `POST /api/patients/` - Criar
- `GET /api/patients/{id}` - Buscar
- `PUT /api/patients/{id}` - Atualizar
- `DELETE /api/patients/{id}` - Deletar

**Dentistas**
- `GET /api/dentists/` - Listar (paginado)
- `POST /api/dentists/` - Criar
- `PUT /api/dentists/{id}` - Atualizar
- `DELETE /api/dentists/{id}` - Deletar

**Consultas**
- `GET /api/appointments/` - Listar (paginado)
- `POST /api/appointments/` - Criar
- `PUT /api/appointments/{id}` - Atualizar
- `DELETE /api/appointments/{id}` - Cancelar
- `PATCH /api/appointments/{id}/status` - Atualizar status

**Dashboard**
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/recent-appointments` - Consultas recentes
- `GET /api/dashboard/monthly` - Consultas mensais

## 🎨 Temas e Estilização

- Design system baseado em Shadcn/ui
- Tailwind CSS para estilização
- Animações suaves com CSS
- Modo responsivo (mobile-first)
- Paleta de cores customizável via CSS variables

## 🛡️ Segurança

- Proteção de rotas com `ProtectedRoute`
- Validação client-side com Zod
- ErrorBoundary para captura de erros
- Sanitização de inputs
- HTTPS recomendado em produção

## 📝 Observações de Desenvolvimento

- Validação de formulários com feedback visual
- Paginação em todas as listagens (12-15 itens/página)
- Busca server-side para melhor performance
- Estados de loading e erro tratados
- Mensagens toast para feedback do usuário

## 🔧 Troubleshooting

**Erro de CORS:**
```
Verifique se o backend está configurado para aceitar requisições da origem do frontend
```

**Token expirado:**
```
O sistema redireciona automaticamente para login. Faça login novamente.
```

**Build falha:**
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules bun.lockb
bun install
bun run build
```

## 📄 Licença

Este projeto é proprietário e confidencial.

## 👥 Time de Desenvolvimento

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.
