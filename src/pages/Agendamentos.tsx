import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovaConsulta from '@/components/NovaConsulta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const initialAppointments = [
  { id: 1, patient: 'Maria Silva', date: '15/12/2025', time: '09:00', doctor: 'Dr. Paulo', type: 'Consulta', status: 'Confirmada' },
  { id: 2, patient: 'João Santos', date: '15/12/2025', time: '10:30', doctor: 'Dra. Ana', type: 'Retorno', status: 'Confirmada' },
  { id: 3, patient: 'Ana Costa', date: '15/12/2025', time: '11:00', doctor: 'Dr. Paulo', type: 'Consulta', status: 'Pendente' },
  { id: 4, patient: 'Carlos Lima', date: '16/12/2025', time: '14:00', doctor: 'Dra. Maria', type: 'Exame', status: 'Confirmada' },
  { id: 5, patient: 'Beatriz Souza', date: '16/12/2025', time: '15:30', doctor: 'Dr. Paulo', type: 'Consulta', status: 'Pendente' },
  { id: 6, patient: 'Ricardo Alves', date: '17/12/2025', time: '08:30', doctor: 'Dra. Ana', type: 'Retorno', status: 'Confirmada' },
];

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState(initialAppointments);

  function handleCreate(newApt: any) {
    setAppointments((prev) => [{ id: prev.length + 1, ...newApt }, ...prev]);
  }

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground">Gerencie todas as consultas agendadas</p>
          </div>
          <NovaConsulta onCreate={handleCreate}>
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
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Paciente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{appointment.patient}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'Confirmada'
                              ? 'bg-success/10 text-success'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {appointment.status}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Agendamentos;
