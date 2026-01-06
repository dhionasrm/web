import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Mail, Smartphone, Plus, Edit, Trash2, Loader2, Save, TestTube2 } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import {
  NotificationSettings,
  NotificationTemplate,
  NotificationTemplateCreate,
  NotificationChannel,
  NotificationTrigger
} from '@/types/api';
import { toast } from 'sonner';

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [testChannel, setTestChannel] = useState<NotificationChannel>('email');
  const [testRecipient, setTestRecipient] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const [templateForm, setTemplateForm] = useState<NotificationTemplateCreate>({
    name: '',
    channel: 'whatsapp',
    trigger: '24h_before',
    message: '',
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [settingsData, templatesData] = await Promise.all([
        notificationService.getSettings(),
        notificationService.listTemplates()
      ]);
      setSettings(settingsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      
      // Tentar carregar do localStorage
      const savedSettings = localStorage.getItem('notification_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
        toast.info('Configurações carregadas localmente');
      } else {
        // Criar settings padrão se não houver nada salvo
        setSettings({
          id: 'default',
          whatsapp_enabled: false,
          sms_enabled: false,
          email_enabled: false,
          notification_24h_enabled: true,
          notification_2h_enabled: true,
          notification_on_confirm_enabled: true,
          updated_at: new Date().toISOString()
        });
        toast.warning('API não disponível. Configurações em modo local.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // Tentar salvar na API
      await notificationService.updateSettings(settings);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      // Salvar localmente se a API falhar
      localStorage.setItem('notification_settings', JSON.stringify(settings));
      toast.success('Configurações salvas localmente (API não disponível)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async () => {
    if (!testRecipient) {
      toast.error('Informe o destinatário para teste');
      return;
    }

    setIsTesting(true);
    try {
      const result = await notificationService.testNotification(testChannel, testRecipient);
      if (result.success) {
        toast.success('Notificação de teste enviada com sucesso!');
        setOpenTestDialog(false);
        setTestRecipient('');
      } else {
        toast.error(result.message || 'Erro ao enviar notificação de teste');
      }
    } catch (error) {
      console.error('Erro ao testar notificação:', error);
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || 'Erro ao enviar notificação de teste');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (editingTemplate) {
        await notificationService.updateTemplate(editingTemplate.id, templateForm);
        toast.success('Template atualizado com sucesso!');
      } else {
        await notificationService.createTemplate(templateForm);
        toast.success('Template criado com sucesso!');
      }
      setOpenTemplateDialog(false);
      resetTemplateForm();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast.error('Erro ao salvar template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Deseja realmente excluir este template?')) return;

    try {
      await notificationService.deleteTemplate(id);
      toast.success('Template excluído com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast.error('Erro ao excluir template');
    }
  };

  const openEditDialog = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      channel: template.channel,
      trigger: template.trigger,
      subject: template.subject,
      message: template.message,
      is_active: template.is_active
    });
    setOpenTemplateDialog(true);
  };

  const resetTemplateForm = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: '',
      channel: 'whatsapp',
      trigger: '24h_before',
      message: '',
      is_active: true
    });
  };

  const getChannelIcon = (channel: NotificationChannel) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'in_app': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getChannelLabel = (channel: NotificationChannel) => {
    const labels = {
      whatsapp: 'WhatsApp',
      email: 'E-mail',
      sms: 'SMS',
      in_app: 'Sistema'
    };
    return labels[channel] || channel;
  };

  const getTriggerLabel = (trigger: NotificationTrigger) => {
    const labels = {
      manual: 'Manual',
      '24h_before': '24h antes',
      '2h_before': '2h antes',
      on_confirm: 'Ao confirmar',
      on_cancel: 'Ao cancelar'
    };
    return labels[trigger] || trigger;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notificações</h1>
            <p className="text-muted-foreground">Gerenciar lembretes e configurações de envio</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpenTestDialog(true)} className="gap-2">
              <TestTube2 className="h-4 w-4" />
              Testar
            </Button>
            <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Configurações
            </Button>
          </div>
        </div>

        <Tabs defaultValue="config" className="space-y-4">
          <TabsList>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-4">
            {/* WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <CardTitle>WhatsApp</CardTitle>
                  </div>
                  <Switch
                    checked={settings?.whatsapp_enabled || false}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, whatsapp_enabled: checked } : {
                      id: 'default',
                      whatsapp_enabled: checked,
                      sms_enabled: false,
                      email_enabled: false,
                      notification_24h_enabled: true,
                      notification_2h_enabled: true,
                      notification_on_confirm_enabled: true,
                      updated_at: new Date().toISOString()
                    })}
                  />
                </div>
                <CardDescription>
                  Envie lembretes via WhatsApp Business API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="Sua chave da API WhatsApp"
                      value={settings?.whatsapp_api_key || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, whatsapp_api_key: e.target.value } : null)}
                      disabled={!settings?.whatsapp_enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Número do WhatsApp</Label>
                    <Input
                      placeholder="+55 11 98765-4321"
                      value={settings?.whatsapp_phone || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, whatsapp_phone: e.target.value } : null)}
                      disabled={!settings?.whatsapp_enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SMS */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                    <CardTitle>SMS</CardTitle>
                  </div>
                  <Switch
                    checked={settings?.sms_enabled || false}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, sms_enabled: checked } : {
                      id: 'default',
                      whatsapp_enabled: false,
                      sms_enabled: checked,
                      email_enabled: false,
                      notification_24h_enabled: true,
                      notification_2h_enabled: true,
                      notification_on_confirm_enabled: true,
                      updated_at: new Date().toISOString()
                    })}
                  />
                </div>
                <CardDescription>
                  Envie lembretes via mensagem SMS
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      placeholder="Sua chave da API SMS"
                      value={settings?.sms_api_key || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, sms_api_key: e.target.value } : null)}
                      disabled={!settings?.sms_enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Remetente</Label>
                    <Input
                      placeholder="Nome do remetente"
                      value={settings?.sms_sender || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, sms_sender: e.target.value } : null)}
                      disabled={!settings?.sms_enabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E-mail */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <CardTitle>E-mail</CardTitle>
                  </div>
                  <Switch
                    checked={settings?.email_enabled || false}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, email_enabled: checked } : {
                      id: 'default',
                      whatsapp_enabled: false,
                      sms_enabled: false,
                      email_enabled: checked,
                      notification_24h_enabled: true,
                      notification_2h_enabled: true,
                      notification_on_confirm_enabled: true,
                      updated_at: new Date().toISOString()
                    })}
                  />
                </div>
                <CardDescription>
                  Envie lembretes por e-mail
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Servidor SMTP</Label>
                    <Input
                      placeholder="smtp.gmail.com"
                      value={settings?.email_smtp_host || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, email_smtp_host: e.target.value } : null)}
                      disabled={!settings?.email_enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Porta SMTP</Label>
                    <Input
                      type="number"
                      placeholder="587"
                      value={settings?.email_smtp_port || ''}
                      onChange={(e) => setSettings(prev => prev ? { ...prev, email_smtp_port: parseInt(e.target.value) } : null)}
                      disabled={!settings?.email_enabled}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>E-mail Remetente</Label>
                  <Input
                    type="email"
                    placeholder="clinica@example.com"
                    value={settings?.email_sender || ''}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, email_sender: e.target.value } : null)}
                    disabled={!settings?.email_enabled}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Automações */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  <CardTitle>Lembretes Automáticos</CardTitle>
                </div>
                <CardDescription>
                  Configure quando os lembretes devem ser enviados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Lembrete 24h antes</Label>
                    <p className="text-sm text-muted-foreground">Enviar lembrete 24 horas antes da consulta</p>
                  </div>
                  <Switch
                    checked={settings?.notification_24h_enabled}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, notification_24h_enabled: checked } : null)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Lembrete 2h antes</Label>
                    <p className="text-sm text-muted-foreground">Enviar lembrete 2 horas antes da consulta</p>
                  </div>
                  <Switch
                    checked={settings?.notification_2h_enabled}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, notification_2h_enabled: checked } : null)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Confirmação de agendamento</Label>
                    <p className="text-sm text-muted-foreground">Enviar notificação ao confirmar consulta</p>
                  </div>
                  <Switch
                    checked={settings?.notification_on_confirm_enabled}
                    onCheckedChange={(checked) => setSettings(prev => prev ? { ...prev, notification_on_confirm_enabled: checked } : null)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Templates de Mensagens</CardTitle>
                    <CardDescription>Personalize as mensagens enviadas aos pacientes</CardDescription>
                  </div>
                  <Button onClick={() => { resetTemplateForm(); setOpenTemplateDialog(true); }} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Gatilho</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Nenhum template cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      templates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getChannelIcon(template.channel)}
                              {getChannelLabel(template.channel)}
                            </div>
                          </TableCell>
                          <TableCell>{getTriggerLabel(template.trigger)}</TableCell>
                          <TableCell>
                            <Badge variant={template.is_active ? 'default' : 'secondary'}>
                              {template.is_active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Template */}
        <Dialog open={openTemplateDialog} onOpenChange={setOpenTemplateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Editar Template' : 'Novo Template'}</DialogTitle>
              <DialogDescription>
                Crie templates personalizados para automatizar o envio de notificações
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Template</Label>
                <Input
                  placeholder="Ex: Lembrete WhatsApp 24h"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Canal</Label>
                  <Select
                    value={templateForm.channel}
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, channel: value as NotificationChannel }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="in_app">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gatilho</Label>
                  <Select
                    value={templateForm.trigger}
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, trigger: value as NotificationTrigger }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h_before">24h antes</SelectItem>
                      <SelectItem value="2h_before">2h antes</SelectItem>
                      <SelectItem value="on_confirm">Ao confirmar</SelectItem>
                      <SelectItem value="on_cancel">Ao cancelar</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {templateForm.channel === 'email' && (
                <div className="space-y-2">
                  <Label>Assunto</Label>
                  <Input
                    placeholder="Assunto do e-mail"
                    value={templateForm.subject || ''}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Mensagem</Label>
                <Textarea
                  placeholder="Digite a mensagem. Use {paciente}, {data}, {hora}, {dentista} para personalizar"
                  value={templateForm.message}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: {'{paciente}'}, {'{data}'}, {'{hora}'}, {'{dentista}'}, {'{procedimento}'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={templateForm.is_active}
                  onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Template ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenTemplateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveTemplate}>
                Salvar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Teste */}
        <Dialog open={openTestDialog} onOpenChange={setOpenTestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Testar Notificação</DialogTitle>
              <DialogDescription>
                Envie uma notificação de teste para verificar a configuração
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Canal</Label>
                <Select
                  value={testChannel}
                  onValueChange={(value) => setTestChannel(value as NotificationChannel)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destinatário</Label>
                <Input
                  placeholder={
                    testChannel === 'email' 
                      ? 'email@example.com' 
                      : '+55 11 98765-4321'
                  }
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenTestDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleTestNotification} disabled={isTesting}>
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Teste'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettingsPage;
