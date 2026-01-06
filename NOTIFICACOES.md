# 📱 Sistema de Notificações e Lembretes Automatizados

## 📋 Visão Geral

Sistema completo de notificações para enviar lembretes automáticos aos pacientes sobre suas consultas, reduzindo o índice de faltas (no-show) e melhorando a comunicação com os pacientes.

## ✨ Funcionalidades Implementadas

### 1. **Múltiplos Canais de Comunicação**
- ✅ WhatsApp Business API
- ✅ SMS
- ✅ E-mail (SMTP)
- ✅ Notificações in-app

### 2. **Templates Personalizáveis**
- Criar templates customizados por canal
- Uso de variáveis dinâmicas: `{paciente}`, `{data}`, `{hora}`, `{dentista}`, `{procedimento}`
- Ativar/desativar templates individualmente
- Templates por gatilho (24h antes, 2h antes, ao confirmar, etc.)

### 3. **Lembretes Automáticos**
- Lembrete 24 horas antes da consulta
- Lembrete 2 horas antes da consulta
- Confirmação automática ao agendar
- Notificação ao cancelar

### 4. **Central de Notificações**
- Badge com contador de notificações não lidas
- Histórico completo de notificações
- Marcar como lida individualmente ou todas
- Status visual (enviado, entregue, falhou, etc.)

### 5. **Envio Manual**
- Opção de enviar notificação ao criar agendamento
- Escolher canais específicos (WhatsApp, SMS, E-mail)
- Teste de configuração de canais

### 6. **Logs e Rastreamento**
- Histórico completo de notificações enviadas
- Status de entrega
- Registro de erros
- Timestamps de envio e leitura

## 🗂️ Arquivos Criados

### Tipos TypeScript
- **`src/types/api.ts`** - Interfaces e tipos:
  - `NotificationChannel`
  - `NotificationStatus`
  - `NotificationTrigger`
  - `NotificationTemplate`
  - `NotificationLog`
  - `NotificationSettings`
  - `SendNotificationRequest`

### Serviços
- **`src/services/notificationService.ts`** - Serviço completo com métodos:
  - `listTemplates()` - Listar templates
  - `createTemplate()` - Criar template
  - `updateTemplate()` - Atualizar template
  - `deleteTemplate()` - Excluir template
  - `listLogs()` - Listar logs de notificações
  - `sendNotification()` - Enviar notificação única
  - `sendBulkNotifications()` - Enviar em lote
  - `getSettings()` - Obter configurações
  - `updateSettings()` - Atualizar configurações
  - `testNotification()` - Testar envio
  - `getUnreadCount()` - Contador de não lidas
  - `getInAppNotifications()` - Notificações in-app
  - `markAsRead()` - Marcar como lida
  - `markAllAsRead()` - Marcar todas como lidas

### Páginas
- **`src/pages/NotificationSettings.tsx`** - Página completa de configurações com:
  - Configurações de WhatsApp (API Key, telefone)
  - Configurações de SMS (API Key, remetente)
  - Configurações de E-mail (SMTP host, porta, remetente)
  - Switches para lembretes automáticos
  - Gerenciamento de templates
  - Teste de envio

### Componentes
- **`src/components/NotificationCenter.tsx`** - Central de notificações:
  - Ícone com badge de contador
  - Popover com lista de notificações
  - Marcação de leitura
  - Auto-refresh a cada 30 segundos

- **`src/components/NovaConsulta.tsx`** - Atualizado com:
  - Checkboxes para envio de notificações
  - Integração com serviço de notificações

### Navegação e Rotas
- **`src/App.tsx`** - Rota adicionada: `/notificacoes`
- **`src/components/AppSidebar.tsx`** - Link no menu: "Notificações"
- **`src/components/DashboardLayout.tsx`** - NotificationCenter no header

## 🚀 Como Usar

### 1. Configurar Canais de Notificação

Acesse **Notificações** no menu lateral e configure cada canal:

#### WhatsApp
```
✓ Ativar WhatsApp
API Key: sua-chave-api
Número: +55 11 98765-4321
```

#### SMS
```
✓ Ativar SMS
API Key: sua-chave-api
Remetente: NomeDaClinica
```

#### E-mail
```
✓ Ativar E-mail
Servidor SMTP: smtp.gmail.com
Porta: 587
E-mail Remetente: clinica@example.com
```

### 2. Criar Templates

Na aba **Templates**, clique em **Novo Template**:

```
Nome: Lembrete WhatsApp 24h
Canal: WhatsApp
Gatilho: 24h antes
Mensagem:
Olá {paciente}! 

Lembramos que sua consulta com Dr(a). {dentista} está agendada para {data} às {hora}.

Confirme sua presença respondendo SIM.

Clínica Dental
```

**Variáveis disponíveis:**
- `{paciente}` - Nome do paciente
- `{data}` - Data da consulta
- `{hora}` - Horário da consulta
- `{dentista}` - Nome do dentista
- `{procedimento}` - Tipo de tratamento

### 3. Ativar Lembretes Automáticos

Configure os gatilhos automáticos:

```
✓ Lembrete 24h antes
✓ Lembrete 2h antes
✓ Confirmação de agendamento
```

### 4. Enviar Notificação Manual

Ao criar um agendamento, marque os canais desejados:

```
☑ Enviar via WhatsApp
☐ Enviar via SMS
☑ Enviar via E-mail
```

### 5. Testar Configuração

Use o botão **Testar** para verificar se a configuração está correta:

```
Canal: WhatsApp
Destinatário: +55 11 98765-4321
[Enviar Teste]
```

## 📊 Central de Notificações

No canto superior direito do dashboard, há um ícone de sino com contador:

- **Badge vermelho**: Número de notificações não lidas
- **Clique no ícone**: Abre popover com lista
- **Clique na notificação**: Marca como lida
- **Botão "Marcar todas como lidas"**: Marca todas de uma vez

## 🔌 Integração com API (Backend)

### Endpoints Necessários

```typescript
// Templates
GET    /api/notifications/templates
POST   /api/notifications/templates
PUT    /api/notifications/templates/:id
DELETE /api/notifications/templates/:id

// Logs
GET    /api/notifications/logs
GET    /api/notifications/logs/:id

// Envio
POST   /api/notifications/send
POST   /api/notifications/send-bulk

// Configurações
GET    /api/notifications/settings
PUT    /api/notifications/settings

// Teste
POST   /api/notifications/test

// In-app
GET    /api/notifications/in-app
GET    /api/notifications/in-app/unread-count
POST   /api/notifications/in-app/:id/read
POST   /api/notifications/in-app/read-all
```

### Exemplo de Request - Enviar Notificação

```json
POST /api/notifications/send
{
  "appointment_id": "123",
  "channel": "whatsapp",
  "template_id": "456",
  "custom_message": "Mensagem opcional"
}
```

### Exemplo de Response - Log de Notificação

```json
{
  "id": "789",
  "appointment_id": "123",
  "patient_id": "456",
  "channel": "whatsapp",
  "recipient": "+5511987654321",
  "message": "Olá João! Lembramos que...",
  "status": "delivered",
  "sent_at": "2026-01-05T10:00:00Z",
  "delivered_at": "2026-01-05T10:00:05Z",
  "created_at": "2026-01-05T09:59:58Z"
}
```

## 🎨 Componentes UI Utilizados

- `Card`, `CardContent`, `CardHeader` - Layout de cards
- `Button` - Botões de ação
- `Input` - Campos de texto
- `Textarea` - Campos de texto longo
- `Switch` - Toggles de ativação
- `Select` - Dropdowns
- `Checkbox` - Seleções múltiplas
- `Dialog` - Modais
- `Tabs` - Navegação por abas
- `Table` - Listagem de templates
- `Badge` - Indicadores de status
- `Popover` - Central de notificações
- `ScrollArea` - Área rolável

## 📈 Benefícios

✅ **Redução de No-Show**: Lembretes diminuem faltas em até 30%  
✅ **Automatização**: Menos trabalho manual para equipe  
✅ **Multi-canal**: Alcance pacientes por vários meios  
✅ **Personalização**: Templates customizados por tipo  
✅ **Rastreamento**: Histórico completo de envios  
✅ **Profissionalismo**: Comunicação organizada e padronizada  

## 🔄 Próximas Melhorias (Sugestões)

- [ ] Agendamento de envios futuros
- [ ] Respostas automáticas (chatbot)
- [ ] Relatórios de efetividade
- [ ] Integração com calendário (iCal)
- [ ] Confirmação via link (clique para confirmar)
- [ ] Notificações push (PWA)
- [ ] Templates em múltiplos idiomas
- [ ] A/B testing de mensagens
- [ ] Webhooks para eventos externos

## 📝 Notas Importantes

⚠️ **Requisitos de API**: Você precisará contratar serviços de terceiros para:
- WhatsApp Business API (Meta/Twilio/MessageBird)
- SMS Gateway (Twilio/AWS SNS/Vonage)
- Servidor SMTP (Gmail/SendGrid/AWS SES)

⚠️ **Custos**: Cada canal tem custos por mensagem. Verifique os preços dos provedores.

⚠️ **Privacidade**: Garanta conformidade com LGPD ao armazenar dados de contato.

⚠️ **Opt-out**: Implemente sistema para pacientes cancelarem notificações.

## 🎯 Conclusão

O sistema de notificações está completamente integrado ao frontend. Agora você precisa:

1. ✅ Implementar os endpoints no backend (API)
2. ✅ Configurar provedores de WhatsApp, SMS e E-mail
3. ✅ Configurar job/cron para envios automáticos
4. ✅ Testar fluxo completo

---

**Desenvolvido para**: Agenda Odontológica  
**Data**: Janeiro 2026  
**Versão**: 1.0.0
