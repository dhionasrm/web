import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail } from 'lucide-react';

const doctors = [
  { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1111', cro: '39404', lastVisit: '10/12/2025' },
  { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-2222', cro: '45012', lastVisit: '08/12/2025' },
  { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-3333', cro: '32109', lastVisit: '05/12/2025' },
  { id: 4, name: 'Carlos Lima', email: 'carlos@email.com', phone: '(11) 99999-4444', cro: '98765', lastVisit: '01/12/2025' },
  { id: 5, name: 'Beatriz Souza', email: 'beatriz@email.com', phone: '(11) 99999-5555', cro: '13579', lastVisit: '28/11/2025' },
  { id: 6, name: 'Ricardo Alves', email: 'ricardo@email.com', phone: '(11) 99999-6666', cro: '24680', lastVisit: '25/11/2025' },
];

const Doutores = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.cro && doctor.cro.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dentistas</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de Dentistas.</p>
          </div>
          <Button className="gradient-primary gap-2">
            <Plus className="w-4 h-4" />
            Novo Dentista
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar doutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor, index) => (
            <Card 
              key={doctor.id} 
              className="shadow-card hover:shadow-elevated transition-all cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {doctor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      CRO: {doctor.cro}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="pt-2 border-t mt-3">
                  <p className="text-xs text-muted-foreground">
                    Último atendimento: <span className="font-medium">{doctor.lastVisit}</span>
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

export default Doutores;
