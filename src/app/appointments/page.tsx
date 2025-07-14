"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppShell } from "@/components/app-shell";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Appointment } from "@/lib/types";
import { appointments as initialAppointments } from "@/lib/data";
import { AddAppointmentDialog } from "@/components/appointments/add-appointment-dialog";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const selectedDayAppointments = React.useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(
      (appointment) => format(appointment.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate]);

  const handleAddAppointment = (newAppointment: Omit<Appointment, 'id' | 'date'>) => {
    if (!selectedDate) return;
    setAppointments(prev => [
      ...prev,
      { ...newAppointment, id: crypto.randomUUID(), date: selectedDate },
    ]);
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
