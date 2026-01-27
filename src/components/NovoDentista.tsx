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
import { toast } from "sonner";
import { isEmailValid } from '@/lib/utils';
import { dentistService } from "@/services/dentistService";
import { DentistCreate } from "@/types/api";
import { dentistSchema } from "@/schemas/forms";
import { z } from "zod";

type Props = {
  children?: React.ReactNode;
  onSuccess?: () => void;
};

const NovoDentista: React.FC<Props> = ({ children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<DentistCreate>({
    nome: "",
    cro: "",
    especialidade: "",
    telefone: "",
    email: "",
  });

  function reset() {
    setFormData({
      nome: "",
      cro: "",
      especialidade: "",
      telefone: "",
      email: "",
    });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      dentistSchema.parse(formData);
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
      await dentistService.create(payload);
      toast.success("Dentista cadastrado com sucesso!");
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar dentista:", error);
      toast.error(error.response?.data?.detail || "Erro ao cadastrar dentista");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? <Button className="gradient-primary gap-2">Novo Dentista</Button>}
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Dentista</DialogTitle>
          <DialogDescription>Preencha os dados do dentista</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo do dentista"
                required
              />
              {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome}</p>}
            </div>

            <div>
              <Label htmlFor="cro">CRO *</Label>
              <Input
                id="cro"
                value={formData.cro}
                onChange={(e) => setFormData({ ...formData, cro: e.target.value })}
                placeholder="Número do CRO"
                required
              />
              {errors.cro && <p className="text-xs text-red-500 mt-1">{errors.cro}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="specialty">Especialidade</Label>
            <Input
              id="specialty"
              value={formData.especialidade}
              onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
              placeholder="Ex: Ortodontia, Implantodontia, etc"
            />
            {errors.especialidade && <p className="text-xs text-red-500 mt-1">{errors.especialidade}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
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

export default NovoDentista;
