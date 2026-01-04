import React, { useState } from "react";
import { formatPhone } from '@/lib/utils';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { usePlans } from '@/hooks/use-plans';
import { toast } from "sonner";
import { isEmailValid } from '@/lib/utils';
import { patientService } from "@/services/patientService";
import { PatientCreate } from "@/types/api";
import { patientSchema } from "@/schemas/forms";
import { z } from "zod";

type Props = {
  children?: React.ReactNode;
  onSuccess?: () => void;
};

const NovoPaciente: React.FC<Props> = ({ children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PatientCreate>({
    nome: "",
    telefone: "",
    tipoAtendimento: '',
    email: "",
    dataNascimento: "",
    observacoes: "",
  });

  const { plans } = usePlans();

  function reset() {
    setFormData({
      nome: "",
      telefone: "",
      tipoAtendimento: '',
      email: "",
      dataNascimento: "",
      observacoes: "",
    });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      // Valida com Zod
      patientSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Corrija os erros no formulário");
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload = { ...formData, telefone: formData.telefone.replace(/\D/g, '') };
      await patientService.create(payload);
      toast.success("Paciente cadastrado com sucesso!");
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar paciente:", error);
      toast.error(error.response?.data?.message || "Erro ao cadastrar paciente");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button className="gradient-primary gap-2">Novo Paciente</Button>}
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Paciente</DialogTitle>
          <DialogDescription>Preencha os dados do paciente</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Nome completo do paciente"
              required
            />
            {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData({ ...formData, telefone: formatted });
                }}
                placeholder="(00) 00000-0000"
                required
              />
              {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="tipoAtendimento">Tipo de Atendimento</Label>
            <div className="flex gap-2 items-start">
              <Select value={formData.tipoAtendimento} onValueChange={(val) => setFormData({ ...formData, tipoAtendimento: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={formData.dataNascimento}
              onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações sobre o paciente..."
              rows={3}
            />
            {errors.observacoes && <p className="text-xs text-red-500 mt-1">{errors.observacoes}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoPaciente;
 
