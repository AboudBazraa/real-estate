"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Check, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "../services/appointmentService";

interface AppointmentSuccessMessageProps {
  appointment: Appointment;
  onClose: () => void;
  onViewAppointments: () => void;
}

export function AppointmentSuccessMessage({
  appointment,
  onClose,
  onViewAppointments,
}: AppointmentSuccessMessageProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), "h:mm a");
    } catch (error) {
      return "Time not specified";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden"
    >
      <div className="bg-green-50 dark:bg-green-900/20 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-800/50 rounded-full p-2">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">
            Appointment Scheduled Successfully
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <h3 className="font-medium text-lg">
            {appointment.property_title || "Property Viewing"}
          </h3>

          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-500" />
            <div>
              <p className="font-medium">
                {formatDate(appointment.appointment_date)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatTime(appointment.appointment_date)}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Appointment Details:</p>
            <ul className="text-sm space-y-1">
              <li className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Client:
                </span>
                <span className="font-medium">{appointment.client_name}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Type:
                </span>
                <span className="font-medium capitalize">
                  {appointment.type}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">
                  Status:
                </span>
                <span className="font-medium capitalize">
                  {appointment.status}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-2 bg-slate-50 dark:bg-slate-800/30 -mx-6 -mb-6 p-6 mt-6">
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An email confirmation has been sent to {appointment.client_email}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={onClose} variant="outline" className="sm:flex-1">
                Schedule Another
              </Button>
              <Button onClick={onViewAppointments} className="sm:flex-1 gap-1">
                View All Appointments
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
