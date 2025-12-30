import React, { useState } from "react";
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
import { toast } from "@/components/ui/use-toast";

export type NewAppointment = {
  patient: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: string;
};

type Props = {
  children?: React.ReactNode;
  onCreate?: (data: NewAppointment) => void;
};

const NovaConsulta: React.FC<Props> = ({ children, onCreate }) => {
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("Dr. Paulo");
  const [type, setType] = useState("Consulta");
  const [status, setStatus] = useState("Pendente");

  function reset() {
    setPatient("");
    setDate("");
    setTime("");
    setDoctor("Dr. Paulo");
    setType("Consulta");
    setStatus("Pendente");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!patient || !date || !time) {
      toast({ title: "Preencha os campos obrigatórios", description: "Paciente, data e horário são obrigatórios." });
      return;
    }

    const data: NewAppointment = { patient, date, time, doctor, type, status };
    onCreate?.(data);
    toast({ title: "Consulta criada", description: `${patient} — ${date} ${time}` });
    setOpen(false);
    reset();
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
            <Label htmlFor="patient">Paciente</Label>
            <Input id="patient" value={patient} onChange={(e) => setPatient(e.target.value)} placeholder="Nome do paciente" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Profissional</Label>
              <Select value={doctor} onValueChange={(val) => setDoctor(val)}>
                <SelectTrigger>
                  <SelectValue>{doctor}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Paulo">Dr. Paulo</SelectItem>
                  <SelectItem value="Dra. Ana">Dra. Ana</SelectItem>
                  <SelectItem value="Dra. Maria">Dra. Maria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(val) => setType(val)}>
                <SelectTrigger>
                  <SelectValue>{type}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Retorno">Retorno</SelectItem>
                  <SelectItem value="Exame">Exame</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger>
                <SelectValue>{status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Confirmada">Confirmada</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovaConsulta;
