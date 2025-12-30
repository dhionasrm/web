import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Clock, CheckCircle } from 'lucide-react';

const stats = [
  {
    title: 'Consultas Hoje',
    value: '12',
    icon: CalendarDays,
    trend: '+2 desde ontem',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Pacientes Ativos',
    value: '284',
    icon: Users,
    trend: '+15 este mês',
    color: 'bg-success/10 text-success',
  },
  {
    title: 'Aguardando',
    value: '3',
    icon: Clock,
    trend: 'Na sala de espera',
    color: 'bg-warning/10 text-warning',
  },
  {
    title: 'Concluídas',
    value: '8',
    icon: CheckCircle,
    trend: 'Hoje',
    color: 'bg-accent text-accent-foreground',
  },
];

const recentAppointments = [
  { id: 1, patient: 'Maria Silva', time: '09:00', type: 'Consulta', status: 'Concluída' },
  { id: 2, patient: 'João Santos', time: '10:30', type: 'Retorno', status: 'Concluída' },
  { id: 3, patient: 'Ana Costa', time: '11:00', type: 'Consulta', status: 'Em andamento' },
  { id: 4, patient: 'Carlos Lima', time: '14:00', type: 'Exame', status: 'Aguardando' },
  { id: 5, patient: 'Beatriz Souza', time: '15:30', type: 'Consulta', status: 'Aguardando' },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo de hoje.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
            <div className="space-y-3">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {appointment.patient.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{appointment.time}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        appointment.status === 'Concluída'
                          ? 'bg-success/10 text-success'
                          : appointment.status === 'Em andamento'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
