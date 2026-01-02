import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovoDentista from '@/components/NovoDentista';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, Loader2 } from 'lucide-react';
import { dentistService } from '@/services/dentistService';
import { Dentist } from '@/types/api';
import { toast } from 'sonner';

const Doutores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDentists = async () => {
    setIsLoading(true);
    try {
      const response = await dentistService.list({ 
        limit: 100,
        search: searchTerm || undefined 
      });
      // A API pode retornar array direto ou objeto com items
      const dentistsList = Array.isArray(response) ? response : (response.items || []);
      setDentists(dentistsList);
    } catch (error: any) {
      console.error('Erro ao carregar dentistas:', error);
      toast.error('Erro ao carregar dentistas');
      setDentists([]); // Garantir array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDentists();
  }, []);

  const filteredDoctors = searchTerm && Array.isArray(dentists)
    ? dentists.filter(
        (dentist) =>
          dentist.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dentist.email && dentist.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          dentist.cro.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (Array.isArray(dentists) ? dentists : []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dentistas</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de Dentistas.</p>
          </div>
          <NovoDentista onSuccess={loadDentists}>
            <Button className="gradient-primary gap-2">
              <Plus className="w-4 h-4" />
              Novo Dentista
            </Button>
          </NovoDentista>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum dentista encontrado</p>
          </div>
        ) : (
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
                      {doctor.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{doctor.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      CRO: {doctor.cro}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {doctor.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{doctor.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{doctor.telefone}</span>
                </div>
                {doctor.especialidade && (
                  <div className="pt-2 border-t mt-3">
                    <p className="text-xs text-muted-foreground">
                      Especialidade: <span className="font-medium">{doctor.especialidade}</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Doutores;
