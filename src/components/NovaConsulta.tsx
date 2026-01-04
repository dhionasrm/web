import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { appointmentService } from "@/services/appointmentService";
import { patientService } from "@/services/patientService";
import { dentistService } from "@/services/dentistService";
import { appointmentSchema } from "@/schemas/forms";
import { z } from "zod";


type Props = {
  children?: React.ReactNode;
  onSuccess?: () => void;
};

const NovaConsulta: React.FC<Props> = ({ children, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [dentists, setDentists] = useState<Array<{ id: string; name: string }>>([]);
  
  const [formData, setFormData] = useState({
    patient_id: "",
    dentist_id: "",
    appointment_date: "",
    duration_minutes: 60,
    treatment_type: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setIsLoadingData(true);
      Promise.all([loadPatients(), loadDentists()])
        .finally(() => setIsLoadingData(false));
    }
  }, [open]);

  async function loadPatients() {
    try {
      const response = await patientService.list({ limit: 100 });
      
      // A API pode retornar array direto ou objeto com items
      const patientsList = Array.isArray(response) ? response : (response.items || []);
      
      if (patientsList.length > 0) {
        setPatients(patientsList.map(p => ({ id: p.id, name: p.nome })));
      } else {
        setPatients([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar pacientes:", error);
      toast.error("Erro ao carregar lista de pacientes");
      setPatients([]);
    }
  }

  async function loadDentists() {
    try {
      const response = await dentistService.list({ limit: 100 });
      
      // A API pode retornar array direto ou objeto com items
      const dentistsList = Array.isArray(response) ? response : (response.items || []);
      
      if (dentistsList.length > 0) {
        setDentists(dentistsList.map(d => ({ id: d.id, name: d.nome })));
      } else {
        setDentists([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar dentistas:", error);
      toast.error("Erro ao carregar lista de dentistas");
      setDentists([]);
    }
  }

  function reset() {
    setFormData({
      patient_id: "",
      dentist_id: "",
      appointment_date: "",
      duration_minutes: 60,
      treatment_type: "",
      notes: "",
    });
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      appointmentSchema.parse(formData);
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
      // Converte datetime-local para ISO string
      const dataHoraInicio = new Date(formData.appointment_date).toISOString();
      
      // Calcula dataHoraFim baseado na duração
      const dataHoraFim = new Date(
        new Date(formData.appointment_date).getTime() + formData.duration_minutes * 60000
      ).toISOString();
      
      // API espera campos em português
      const data = {
        pacienteId: parseInt(formData.patient_id),
        dentistaId: parseInt(formData.dentist_id),
        dataHoraInicio,
        dataHoraFim,
        tipoTratamento: formData.treatment_type || undefined,
        observacoes: formData.notes || undefined,
      };
      
      await appointmentService.create(data);
      toast.success("Consulta agendada com sucesso!");
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar consulta:", error);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Erro ao agendar consulta";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children ?? <Button className="gradient-primary gap-2">Nova Consulta</Button>}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova consulta</DialogTitle>
          <DialogDescription>Preencha os dados para agendar uma nova consulta.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
          <div>
            <Label htmlFor="patient_id">Paciente *</Label>
            <Select 
              value={formData.patient_id} 
              onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
              disabled={isLoadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione o paciente"} />
              </SelectTrigger>
              <SelectContent>
                {patients.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum paciente cadastrado
                  </SelectItem>
                ) : (
                  patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.patient_id && <p className="text-xs text-red-500 mt-1">{errors.patient_id}</p>}
          </div>

          <div>
            <Label htmlFor="dentist_id">Dentista *</Label>
            <Select 
              value={formData.dentist_id} 
              onValueChange={(val) => setFormData({ ...formData, dentist_id: val })}
              disabled={isLoadingData}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione o dentista"} />
              </SelectTrigger>
              <SelectContent>
                {dentists.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Nenhum dentista cadastrado
                  </SelectItem>
                ) : (
                  dentists.map((dentist) => (
                    <SelectItem key={dentist.id} value={dentist.id}>
                      {dentist.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.dentist_id && <p className="text-xs text-red-500 mt-1">{errors.dentist_id}</p>}
          </div>

          <div>
            <Label htmlFor="appointment_date">Data e Horário *</Label>
            <Input 
              id="appointment_date" 
              type="datetime-local" 
              value={formData.appointment_date} 
              onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })} 
              required
            />
            {errors.appointment_date && <p className="text-xs text-red-500 mt-1">{errors.appointment_date}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input 
                id="duration_minutes" 
                type="number"
                min="15"
                step="15"
                value={formData.duration_minutes} 
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })} 
              />
              {errors.duration_minutes && <p className="text-xs text-red-500 mt-1">{errors.duration_minutes}</p>}
            </div>

            <div>
              <Label htmlFor="treatment_type">Tipo de Tratamento</Label>
              <Input
                id="treatment_type"
                value={formData.treatment_type}
                onChange={(e) => setFormData({ ...formData, treatment_type: e.target.value })}
                placeholder="Ex: Limpeza, Consulta, Extração"
              />
              {errors.treatment_type && <p className="text-xs text-red-500 mt-1">{errors.treatment_type}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
            {errors.notes && <p className="text-xs text-red-500 mt-1">{errors.notes}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaConsulta;
