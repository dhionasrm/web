import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovaConsulta from '@/components/NovaConsulta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal, Loader2, Trash2 } from 'lucide-react';
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { appointmentService } from '@/services/appointmentService';
import { Appointment } from '@/types/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await appointmentService.list({ limit: 100 });
      // response can be a paginated object or an array depending on API
      const items = Array.isArray(response) ? response : (response.items ?? []);
      setAppointments(items || []);
    } catch (error: any) {
      console.error('Erro ao carregar consultas:', error);
      toast.error('Erro ao carregar consultas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = (appointments || []).filter((apt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const patientName = apt.patient?.nome ?? '';
    const dentistName = apt.dentist?.nome ?? '';
    return patientName.toLowerCase().includes(term) || dentistName.toLowerCase().includes(term);
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-500/10 text-blue-500',
      confirmed: 'bg-success/10 text-success',
      in_progress: 'bg-purple-500/10 text-purple-500',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-destructive/10 text-destructive',
      no_show: 'bg-warning/10 text-warning',
    };
    return colors[status] || 'bg-muted/10 text-muted-foreground';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendada',
      confirmed: 'Confirmada',
      in_progress: 'Em Andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada',
      no_show: 'Não Compareceu',
    };
    return labels[status] || status;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie todas as consultas agendadas</p>
          </div>
          <NovaConsulta onSuccess={loadAppointments}>
            <Button className="gradient-primary gap-2">
              <Plus className="w-4 h-4" />
              Nova Consulta
            </Button>
          </NovaConsulta>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente ou médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma consulta encontrada</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Paciente</TableHead>
                      <TableHead>Dentista</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{appointment.patient?.nome || 'N/A'}</TableCell>
                        <TableCell>{appointment.dentist?.nome || 'N/A'}</TableCell>
                        <TableCell>{appointment.appointment_date ? format(new Date(appointment.appointment_date), 'dd/MM/yyyy') : '-'}</TableCell>
                        <TableCell>{appointment.appointment_date ? format(new Date(appointment.appointment_date), 'HH:mm') : '-'}</TableCell>
                        <TableCell>{appointment.treatment_type || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedId(appointment.id);
                                setSelectedLabel(`${appointment.patient?.nome ?? 'N/A'} - ${appointment.appointment_date ? format(new Date(appointment.appointment_date), 'dd/MM/yyyy HH:mm') : '-'}`);
                                setReason('');
                                setOpenDelete(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar consulta</DialogTitle>
              <DialogDescription>
                Você está cancelando a consulta: <strong>{selectedLabel}</strong>. Informe o motivo do cancelamento.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo do cancelamento" />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!selectedId) return;
                  setIsDeleting(true);
                  try {
                    await appointmentService.cancel(selectedId, reason || undefined);
                    toast.success('Consulta cancelada com sucesso');
                    setOpenDelete(false);
                    loadAppointments();
                  } catch (err) {
                    console.error(err);
                    toast.error('Erro ao cancelar consulta');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Cancelando...' : 'Confirmar cancelamento'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;
