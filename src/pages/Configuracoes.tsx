import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building, Bell, Shield, Palette, Check, X, Trash2 } from 'lucide-react';
import * as React from 'react';
import { usePlans } from '@/hooks/use-plans';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import { formatPhone } from '@/lib/utils';

const Configuracoes = () => {
  const [open, setOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const [clinicPhone, setClinicPhone] = React.useState('(11) 3333-4444');

  const criteria = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword),
  };

  const strengthScore = () => {
    const vals = Object.values(criteria).filter(Boolean).length;
    return Math.min(100, Math.round((vals / Object.keys(criteria).length) * 100));
  };

  const handleChangePassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('A confirmação da senha não corresponde.');
      return;
    }
    if (!Object.values(criteria).every(Boolean)) {
      toast.error('A senha deve cumprir todos os requisitos.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      toast.success('Senha alterada com sucesso.');
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      toast.error('Erro ao alterar senha. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compact plan manager modal (discrete, used by the Planos card)
  function PlanManager() {
    const { plans, addPlan, removePlan } = usePlans();
    const [planOpen, setPlanOpen] = React.useState(false);
    const [newPlan, setNewPlan] = React.useState('');

    return (
      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Gerenciar planos</Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Controle de planos</DialogTitle>
            <DialogDescription>Adicione ou remova planos usados no cadastro de pacientes.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="flex gap-2">
              <Input placeholder="Novo plano (ex: Plano C)" value={newPlan} onChange={(e) => setNewPlan(e.target.value)} />
              <Button onClick={() => { if (newPlan.trim()) { addPlan(newPlan.trim()); setNewPlan(''); } }}>Adicionar</Button>
            </div>

            <div className="grid gap-2">
              {plans.map((p) => (
                <div key={p} className="flex items-center justify-between bg-muted/10 px-3 py-1 rounded">
                  <span>{p}</span>
                  <button className="text-destructive" onClick={() => removePlan(p)} aria-label={`Remover ${p}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as preferências do sistema</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Informações da Clínica</CardTitle>
                <CardDescription>Dados básicos do estabelecimento</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Nome da Clínica</Label>
                <Input id="clinicName" defaultValue="MedAgenda Clínica" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={clinicPhone} onChange={(e) => setClinicPhone(formatPhone(e.target.value))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" defaultValue="Rua das Flores, 123 - São Paulo, SP" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Planos</CardTitle>
                <CardDescription>Gerencie os tipos de atendimento (discreto)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Controle de planos</p>
                <p className="text-sm text-muted-foreground">Adicione ou remova planos usados no cadastro de pacientes</p>
              </div>
              <PlanManager />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Notificações</CardTitle>
                <CardDescription>Configure alertas e lembretes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Lembrete de consulta</p>
                <p className="text-sm text-muted-foreground">Enviar SMS 24h antes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email de confirmação</p>
                <p className="text-sm text-muted-foreground">Ao agendar nova consulta</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Alertas do sistema</p>
                <p className="text-sm text-muted-foreground">Notificações importantes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Segurança</CardTitle>
                <CardDescription>Configurações de acesso e senha</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Alterar Senha</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Senha</DialogTitle>
                  <DialogDescription>Altere sua senha atual de forma segura.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Senha atual</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-2">
                    <Progress value={strengthScore()} />
                    <div className="flex items-center justify-between text-xs mt-2 text-muted-foreground">
                      <span>Nível: {strengthScore() >= 80 ? 'Forte' : strengthScore() >= 50 ? 'Média' : 'Fraca'}</span>
                      <span>{strengthScore()}%</span>
                    </div>
                    <ul className="mt-3 grid grid-cols-1 gap-1 text-sm">
                      {Object.entries(criteria).map(([key, ok]) => (
                        <li key={key} className="flex items-center gap-2 text-sm">
                          {ok ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline" type="button">Cancelar</Button>
                    </DialogClose>
                    <Button type="submit" className="gradient-primary" disabled={isLoading}>
                      {isLoading ? 'Alterando...' : 'Alterar senha'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="gradient-primary">Salvar Alterações</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuracoes;
