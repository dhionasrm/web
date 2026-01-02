import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovoPaciente from '@/components/NovoPaciente';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, CreditCard, Loader2, Trash2 } from 'lucide-react';
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
import { patientService } from '@/services/patientService';
import { Patient } from '@/types/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.list({ 
        limit: 100,
        search: searchTerm || undefined 
      });
      // A API pode retornar array direto ou objeto com items
      const patientsList = Array.isArray(response) ? response : (response.items || []);
      setPatients(patientsList);
    } catch (error: any) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
      setPatients([]); // Garantir array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = searchTerm && Array.isArray(patients)
    ? patients.filter((patient) => {
        const term = searchTerm.toLowerCase();
        return (
          patient.nome.toLowerCase().includes(term) ||
          (patient.cpf && patient.cpf.toLowerCase().includes(term)) ||
          patient.telefone.toLowerCase().includes(term)
        );
      })
    : (Array.isArray(patients) ? patients : []);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de pacientes</p>
          </div>
          <NovoPaciente onSuccess={loadPatients}>
            <Button className="gradient-primary gap-2">
              <Plus className="w-4 h-4" />
              Novo Paciente
            </Button>
          </NovoPaciente>
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum paciente encontrado</p>
          </div>
        ) : (
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
                      {patient.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {patient.dataNascimento && `Nascimento: ${format(new Date(patient.dataNascimento), 'dd/MM/yyyy')}`}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {patient.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{patient.telefone}</span>
                </div>
                {patient.cpf && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>{patient.cpf}</span>
                  </div>
                )}
                {patient.observacoes && (
                  <div className="pt-2 border-t mt-3">
                    <p className="text-xs text-muted-foreground">
                      Observações: <span className="font-medium">{patient.observacoes}</span>
                    </p>
                  </div>
                )}
                <div className="pt-3 border-t mt-3 flex gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedId(patient.id);
                      setSelectedName(patient.nome);
                      setReason('');
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover paciente</DialogTitle>
            <DialogDescription>
              Você está removendo <strong>{selectedName}</strong>. Informe o motivo da remoção.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo da remoção" />
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
                  await patientService.delete(selectedId, reason || undefined);
                  toast.success('Paciente removido com sucesso');
                  setOpenDelete(false);
                  loadPatients();
                } catch (err) {
                  console.error(err);
                  toast.error('Erro ao remover paciente');
                } finally {
                  setIsDeleting(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Removendo...' : 'Confirmar remoção'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Pacientes;
