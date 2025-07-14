"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppShell } from "@/components/app-shell";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import type { Appointment } from "@/lib/types";
import { AddAppointmentDialog } from "@/components/appointments/add-appointment-dialog";
import { getAppointments, addAppointment } from "@/lib/services";
import { useToast } from "@/hooks/use-toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const fetchedAppointments = await getAppointments();
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast({
          variant: "destructive",
          title: "Erro ao Carregar Dados",
          description: "Não foi possível buscar os compromissos do banco de dados.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const selectedDayAppointments = React.useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(
      (appointment) => format(new Date(appointment.date), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  const handleAddAppointment = async (newAppointment: Omit<Appointment, 'id' | 'date'>) => {
    if (!selectedDate) return;
    try {
        const appointmentData = { ...newAppointment, date: selectedDate };
        const addedAppointment = await addAppointment(appointmentData);
        setAppointments(prev => [...prev, addedAppointment].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
        console.error("Failed to add appointment:", error);
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: "Não foi possível adicionar o novo compromisso.",
        });
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Compromissos</h1>
            <p className="text-muted-foreground">Gerencie sua agenda e compromissos.</p>
          </div>
        </div>
        {loading ? (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <AppointmentCalendar
                  appointments={appointments}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 h-96 overflow-y-auto">
                    {selectedDayAppointments.length > 0 ? (
                      selectedDayAppointments.map(app => (
                        <div key={app.id} className="p-3 rounded-lg border bg-card text-sm">
                          <p className="font-semibold">{app.title}</p>
                          <p className="text-muted-foreground">{app.startTime} - {app.endTime}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <p>Nenhum compromisso para este dia.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                     <Button className="w-full" onClick={() => setIsDialogOpen(true)} disabled={!selectedDate}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Compromisso
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
        )}
      </div>
      <AddAppointmentDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAppointmentAdded={handleAddAppointment}
        selectedDate={selectedDate}
      />
    </AppShell>
  );
}
