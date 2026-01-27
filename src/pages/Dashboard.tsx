import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { DashboardStats, RecentAppointment } from '@/types/api';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, appointmentsData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentAppointments()
      ]);
      
      setStats(statsData);
      setRecentAppointments(appointmentsData);
    } catch (error: any) {
      console.error('Erro ao carregar dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = stats ? [
    {
      title: 'Consultas Hoje',
      value: String(stats.appointments_today),
      icon: CalendarDays,
      trend: `${stats.appointments_this_week} esta semana`,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Pacientes Ativos',
      value: String(stats.total_patients),
      icon: Users,
      trend: `${stats.total_patients} total`,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Consultas Mês',
      value: String(stats.appointments_this_month),
      icon: Clock,
      trend: 'Neste mês',
      color: 'bg-warning/10 text-warning',
    },
    {
      title: 'Dentistas',
      value: String(stats.total_dentists),
      icon: CheckCircle,
      trend: 'Total cadastrado',
      color: 'bg-accent text-accent-foreground',
    },
  ] : [];

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      scheduled: 'Agendada',
      confirmed: 'Confirmada',
      in_progress: 'Em andamento',
      completed: 'Concluída',
      cancelled: 'Cancelada',
      no_show: 'Não compareceu'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      scheduled: 'bg-blue-500/10 text-blue-500',
      confirmed: 'bg-green-500/10 text-green-500',
      in_progress: 'bg-purple-500/10 text-purple-500',
      completed: 'bg-success/10 text-success',
      cancelled: 'bg-red-500/10 text-red-500',
      no_show: 'bg-gray-500/10 text-gray-500'
    };
    return colorMap[status] || 'bg-gray-500/10 text-gray-500';
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo de hoje.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="shadow-card hover:shadow-elevated transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Consultas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma consulta para hoje
              </div>
            ) : (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {appointment.patient_name ? appointment.patient_name.charAt(0).toUpperCase() : 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.patient_name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.treatment_type || 'Consulta'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {appointment.appointment_date 
                          ? format(new Date(appointment.appointment_date), 'HH:mm', { locale: ptBR })
                          : '--:--'
                        }
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusLabel(appointment.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
