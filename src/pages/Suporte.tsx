import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { LifeBuoy, Phone, MessageSquare } from "lucide-react";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  priority: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
};

const Suporte: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!subject || !description) {
      toast({ title: "Preencha os campos obrigatórios", description: "Assunto e descrição são obrigatórios." });
      return;
    }

    const newTicket: Ticket = {
      id: tickets.length + 1,
      subject,
      description,
      priority,
      contactEmail: email,
      contactPhone: phone,
      createdAt: new Date().toLocaleString(),
    };

    setTickets((prev) => [newTicket, ...prev]);
    toast({ title: "Chamado criado", description: `Chamado #${newTicket.id} criado com sucesso.` });
    setSubject("");
    setDescription("");
    setPriority("Normal");
    setEmail("");
    setPhone("");
  }

  function handleWhatsApp() {
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
      toast({ title: "Número não informado", description: "Informe um telefone para chamar no WhatsApp." });
      return;
    }
    const text = encodeURIComponent(subject || 'Olá, preciso de suporte');
    const url = `https://wa.me/${digits.startsWith('55') ? digits : '55' + digits}?text=${text}`;
    window.open(url, '_blank');
  }

  function handleCall() {
    const digits = phone.replace(/\D/g, '');
    if (!digits) {
      toast({ title: "Número não informado", description: "Informe um telefone para realizar a chamada." });
      return;
    }
    window.location.href = `tel:${digits}`;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <LifeBuoy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Suporte</h1>
            <p className="text-muted-foreground">Abra um chamado para nossa equipe de suporte</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Abrir novo chamado</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input placeholder="Assunto" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea placeholder="Descreva o problema ou solicitação" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <Select value={priority} onValueChange={(val) => setPriority(val)}>
                    <SelectTrigger>
                      <SelectValue>{priority}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Input placeholder="E-mail para contato (opcional)" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Telefone para contato (opcional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="submit">Abrir chamado</Button>
              </div>
            </form>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={handleCall} className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Ligar
              </Button>

              <Button onClick={handleWhatsApp} className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Atendimento no WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {tickets.length > 0 && (
          <div className="grid gap-3">
            {tickets.map((t) => (
              <Card key={t.id} className="shadow-card">
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{t.subject}</h3>
                    <p className="text-xs text-muted-foreground">#{t.id} • {t.createdAt} • Prioridade: {t.priority}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{t.description}</p>
                  <div className="mt-2 text-xs text-muted-foreground">Contato: {t.contactEmail || '-'} • {t.contactPhone || '-'}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Suporte;
