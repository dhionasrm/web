import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovaConsulta from '@/components/NovaConsulta';
import { Pagination } from '@/components/Pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Loader2, Trash2, Filter, MoreHorizontal } from 'lucide-react';
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { dentistService } from '@/services/dentistService';
import { Appointment, Patient, Dentist } from '@/types/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ITEMS_PER_PAGE = 15;

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const loadAppointments = async (page: number = currentPage) => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      
      // Carrega dados em paralelo
      const [appointmentsRes, patientsRes, dentistsRes] = await Promise.all([
        appointmentService.list({ 
          skip,
          limit: ITEMS_PER_PAGE,
          search: searchTerm || undefined
        }),
        patientService.list({ limit: 200 }),
        dentistService.list({ limit: 200 })
      ]);
      
      let appointmentsList = Array.isArray(appointmentsRes) ? appointmentsRes : (appointmentsRes.items ?? []);
      const patientsList = Array.isArray(patientsRes) ? patientsRes : (patientsRes.items ?? []);
      const dentistsList = Array.isArray(dentistsRes) ? dentistsRes : (dentistsRes.items ?? []);

      // Aplicar filtros locais
      if (statusFilter !== 'all') {
        appointmentsList = appointmentsList.filter((apt: any) => apt.status === statusFilter);
      }

      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        appointmentsList = appointmentsList.filter((apt: any) => {
          const aptDate = new Date(apt.dataHoraInicio);
          return aptDate.toDateString() === filterDate.toDateString();
        });
      }

      setAppointments(appointmentsList);
      setPatients(patientsList);
      setDentists(dentistsList);
      
      if (Array.isArray(appointmentsRes)) {
        setTotalItems(appointmentsList.length);
      } else {
        setTotalItems(appointmentsRes.total || appointmentsList.length);
      }
    } catch (error: any) {
      console.error('Erro ao carregar consultas:', error);
      toast.error('Erro ao carregar consultas');
      setAppointments([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments(currentPage);
  }, [currentPage, searchTerm, statusFilter, dateFilter]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setCurrentPage(1);
  };

  // Função para buscar nome do paciente pelo ID
  const getPatientName = (patientId: number) => {
    const patient = patients.find(p => String(p.id) === String(patientId));
    return patient?.nome || 'N/A';
  };

  // Função para buscar nome do dentista pelo ID
  const getDentistName = (dentistId: number) => {
    const dentist = dentists.find(d => String(d.id) === String(dentistId));
    return dentist?.nome || 'N/A';
  };

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
          <NovaConsulta onSuccess={() => loadAppointments(1)}>
            <Button className="gradient-primary gap-2">
              <Plus className="w-4 h-4" />
              Nova Consulta
            </Button>
          </NovaConsulta>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente ou dentista..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  Buscar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="status-filter" className="text-xs mb-1">Status</Label>
                  <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="scheduled">Agendada</SelectItem>
                      <SelectItem value="confirmed">Confirmada</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                      <SelectItem value="no_show">Não Compareceu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="date-filter" className="text-xs mb-1">Data</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  />
                </div>

                <Button variant="outline" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || dateFilter ? 'Nenhuma consulta encontrada' : 'Nenhuma consulta agendada'}
                </p>
              </div>
            ) : (
              <>
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
                      {appointments.map((appointment) => {
                        const patientName = getPatientName(appointment.pacienteId);
                        const dentistName = getDentistName(appointment.dentistaId);
                        const appointmentDate = appointment.dataHoraInicio ? new Date(appointment.dataHoraInicio) : null;
                      
                      return (
                        <TableRow key={appointment.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{patientName}</TableCell>
                          <TableCell>{dentistName}</TableCell>
                          <TableCell>{appointmentDate ? format(appointmentDate, 'dd/MM/yyyy') : '-'}</TableCell>
                          <TableCell>{appointmentDate ? format(appointmentDate, 'HH:mm') : '-'}</TableCell>
                          <TableCell>{appointment.tipoTratamento || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status || 'scheduled')}`}>
                              {getStatusLabel(appointment.status || 'scheduled')}
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
                                  setSelectedLabel(`${patientName} - ${appointmentDate ? format(appointmentDate, 'dd/MM/yyyy HH:mm') : '-'}`);
                                  setReason('');
                                  setOpenDelete(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={ITEMS_PER_PAGE}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </>
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
                    loadAppointments(currentPage);
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
