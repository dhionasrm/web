import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, CreditCard } from 'lucide-react';

const patients = [
  { id: 1, name: 'Maria Silva', cpf: '123.456.789-00', email: 'maria@email.com', phone: '(11) 99999-1111', birthDate: '15/03/1985', lastVisit: '10/12/2025', contract: 'Plano' },
  { id: 2, name: 'João Santos', cpf: '987.654.321-00', email: 'joao@email.com', phone: '(11) 99999-2222', birthDate: '22/07/1978', lastVisit: '08/12/2025', contract: 'Particular' },
  { id: 3, name: 'Ana Costa', cpf: '111.222.333-44', email: 'ana@email.com', phone: '(11) 99999-3333', birthDate: '05/11/1990', lastVisit: '05/12/2025', contract: 'Plano' },
  { id: 4, name: 'Carlos Lima', cpf: '555.666.777-88', email: 'carlos@email.com', phone: '(11) 99999-4444', birthDate: '18/01/1982', lastVisit: '01/12/2025', contract: 'Particular' },
  { id: 5, name: 'Beatriz Souza', cpf: '222.333.444-55', email: 'beatriz@email.com', phone: '(11) 99999-5555', birthDate: '30/09/1995', lastVisit: '28/11/2025', contract: 'Plano' },
  { id: 6, name: 'Ricardo Alves', cpf: '666.777.888-99', email: 'ricardo@email.com', phone: '(11) 99999-6666', birthDate: '12/06/1970', lastVisit: '25/11/2025', contract: 'Particular' },
];

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    return (
      patient.name.toLowerCase().includes(term) ||
      patient.cpf.toLowerCase().includes(term) ||
      patient.phone.toLowerCase().includes(term)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de pacientes</p>
          </div>
          <Button className="gradient-primary gap-2">
            <Plus className="w-4 h-4" />
            Novo Paciente
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient, index) => (
            <Card 
              key={patient.id} 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Nascimento: {patient.birthDate}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  <span>{patient.cpf}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-sm">Contrato: <span className="font-medium text-foreground">{patient.contract}</span></span>
                </div>
                <div className="pt-2 border-t mt-3">
                  <p className="text-xs text-muted-foreground">
                    Última consulta: <span className="font-medium">{patient.lastVisit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pacientes;
