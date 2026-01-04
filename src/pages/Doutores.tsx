import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import NovoDentista from '@/components/NovoDentista';
import { Pagination } from '@/components/Pagination';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Phone, Mail, Loader2, Trash2 } from 'lucide-react';
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
import { dentistService } from '@/services/dentistService';
import { Dentist } from '@/types/api';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

const Doutores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const loadDentists = async (page: number = currentPage, search: string = searchTerm) => {
    setIsLoading(true);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const response = await dentistService.list({ 
        skip,
        limit: ITEMS_PER_PAGE,
        search: search || undefined,
        is_active: true
      });
      
      if (Array.isArray(response)) {
        setDentists(response);
        setTotalItems(response.length);
      } else {
        setDentists(response.items || []);
        setTotalItems(response.total || 0);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dentistas:', error);
      toast.error('Erro ao carregar dentistas');
      setDentists([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDentists(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dentistas</h1>
            <p className="text-muted-foreground">Cadastro e gerenciamento de Dentistas.</p>
          </div>
          <NovoDentista onSuccess={() => loadDentists(1, searchTerm)}>
            <Button className="gradient-primary gap-2">
              <Plus className="w-4 h-4" />
              Novo Dentista
            </Button>
          </NovoDentista>
        </div>

        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CRO ou email..."
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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : dentists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? 'Nenhum dentista encontrado' : 'Nenhum dentista cadastrado'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dentists.map((doctor, index) => (
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
                  <div className="pt-3 border-t mt-3 flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedId(doctor.id);
                        setSelectedName(doctor.nome);
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
        
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover dentista</DialogTitle>
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
                    await dentistService.delete(selectedId, reason || undefined);
                    toast.success('Dentista removido com sucesso');
                    setOpenDelete(false);
                    loadDentists(currentPage, searchTerm);
                  } catch (err) {
                    console.error(err);
                    toast.error('Erro ao remover dentista');
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

export default Doutores;
