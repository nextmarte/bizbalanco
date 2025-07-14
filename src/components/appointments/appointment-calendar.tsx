"use client";

import { Calendar } from "@/components/ui/calendar";
import type { Appointment } from "@/lib/types";
import { ptBR } from 'date-fns/locale';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

export function AppointmentCalendar({
  appointments,
  selectedDate,
  onDateChange,
}: AppointmentCalendarProps) {
  const appointmentDates = appointments.map(app => new Date(app.date));

  return (
    <Calendar
      locale={ptBR}
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      className="rounded-md border"
      modifiers={{
        hasAppointment: appointmentDates,
      }}
      modifiersStyles={{
        hasAppointment: {
          fontWeight: 'bold',
          position: 'relative',
        },
      }}
      components={{
        DayContent: (props) => {
            const hasAppointment = appointmentDates.some(d => d.toDateString() === props.date.toDateString());
            return (
                <div className="relative">
                    {props.date.getDate()}
                    {hasAppointment && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                </div>
            )
        }
      }}
    />
  );
}
