import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, Clock, User, UserCog, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { dashboardService } from '@/services/dashboardService';
import { appointmentService } from '@/services/appointmentService';
import { patientService } from '@/services/patientService';
import { dentistService } from '@/services/dentistService';
import { MonthlyAppointment, Appointment } from '@/types/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [isLoadingDay, setIsLoadingDay] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    loadMonthlyAppointments();
  }, [currentDate]);

  const loadMonthlyAppointments = async () => {
    setIsLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await dashboardService.getMonthlyAppointments(year, month) as any;
      
      // O backend retorna { appointmentsByDay: { "5": 1, "6": 2 }, month: 1, year: 2026 }
      const appointmentsByDay = response.appointmentsByDay || {};
      
      // Converte as chaves string para number
      const formattedAppointments: Record<number, number> = {};
      Object.entries(appointmentsByDay).forEach(([day, count]) => {
        formattedAppointments[parseInt(day)] = count as number;
      });
      
      setAppointments(formattedAppointments);
    } catch (error: any) {
      console.error('❌ Erro ao carregar consultas mensais:', error);
      toast.error('Erro ao carregar consultas do mês');
    } finally {
      setIsLoading(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const handleDayClick = async (day: number) => {
    if (!appointments[day]) return; // Se não tem consultas, não faz nada
    
    setSelectedDay(day);
    setIsLoadingDay(true);
    
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Busca todas as consultas - o backend retorna um array direto, não { data: [] }
      const appointmentsList = await appointmentService.list({
        skip: 0,
        limit: 100,
      });
      
      // O backend retorna array direto, não objeto PaginatedResponse
      const dataArray = Array.isArray(appointmentsList) ? appointmentsList : [];
      
      const filtered = dataArray.filter((apt: any) => {
        // O backend retorna dataHoraInicio ao invés de date
        const aptDate = new Date(apt.dataHoraInicio || apt.date);
        const aptDateStr = aptDate.toISOString().split('T')[0];
        return aptDateStr === dateStr;
      });
      
      // Busca os dados completos de pacientes e dentistas
      const enrichedAppointments = await Promise.all(
        filtered.map(async (apt: any) => {
          try {
            const [patient, dentist] = await Promise.all([
              patientService.getById(apt.pacienteId || apt.patient_id),
              dentistService.getById(apt.dentistaId || apt.dentist_id),
            ]);
            
            return {
              ...apt,
              patient_name: patient.name || patient.nome,
              dentist_name: dentist.name || dentist.nome,
            };
          } catch (error) {
            console.error('Erro ao buscar dados de paciente/dentista:', error);
            return {
              ...apt,
              patient_name: 'N/A',
              dentist_name: 'N/A',
            };
          }
        })
      );
      
      setDayAppointments(enrichedAppointments as Appointment[]);
    } catch (error) {
      console.error('❌ Erro ao carregar consultas do dia:', error);
      toast.error('Erro ao carregar consultas do dia');
    } finally {
      setIsLoadingDay(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      scheduled: { label: 'Agendada', className: 'bg-blue-100 text-blue-800' },
      confirmed: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
      in_progress: { label: 'Em Andamento', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Concluída', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
      no_show: { label: 'Não Compareceu', className: 'bg-orange-100 text-orange-800' },
    };

    const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`text-xs px-2 py-1 rounded ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
          <p className="text-muted-foreground">Visualize todas as consultas do mês</p>
        </div>

        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth} disabled={isLoading}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth} disabled={isLoading}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const hasAppointments = appointments[day];

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`p-2 min-h-[80px] rounded-lg border transition-colors ${
                        hasAppointments ? 'cursor-pointer hover:bg-muted/50' : 'cursor-default'
                      } ${
                        isToday(day) ? 'bg-primary/10 border-primary' : 'border-border'
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isToday(day) ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {day}
                      </span>
                      {hasAppointments && (
                        <div className="mt-1">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {hasAppointments} {hasAppointments === 1 ? 'consulta' : 'consultas'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog com lista de consultas do dia */}
        <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>
                  Consultas de {selectedDay} de {monthNames[currentDate.getMonth()]}
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
              <DialogDescription className="sr-only">
                Lista de consultas agendadas para o dia selecionado
              </DialogDescription>
            </DialogHeader>

            {isLoadingDay ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma consulta encontrada para este dia.
              </div>
            ) : (
              <div className="space-y-3">
                {dayAppointments.map((apt: any) => (
                  <Card key={apt.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(apt.dataHoraInicio || apt.date), 'HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        {getStatusBadge(apt.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">Paciente:</span> {apt.patient_name || apt.nomePaciente || 'N/A'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">Dentista:</span> {apt.dentist_name || apt.nomeDentista || 'N/A'}
                          </span>
                        </div>

                        {apt.treatment_type && (
                          <div className="text-sm">
                            <span className="font-medium">Tratamento:</span> {apt.treatment_type}
                          </div>
                        )}

                        {apt.notes && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Observações:</span> {apt.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Calendario;
