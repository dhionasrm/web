import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovaConsulta from '@/components/NovaConsulta';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal, Loader2 } from 'lucide-react';
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

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const response = await appointmentService.list({ limit: 100 });
      setAppointments(response.items);
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

  const filteredAppointments = searchTerm
    ? appointments.filter(
        (apt) =>
          apt.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.dentist?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : appointments;

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
                        <TableCell className="font-medium">{appointment.patient?.name || 'N/A'}</TableCell>
                        <TableCell>{appointment.dentist?.name || 'N/A'}</TableCell>
                        <TableCell>{format(new Date(appointment.appointment_date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(appointment.appointment_date), 'HH:mm')}</TableCell>
                        <TableCell>{appointment.treatment_type || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;
