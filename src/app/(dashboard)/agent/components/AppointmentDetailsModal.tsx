"use client";

import { useState } from "react";
import { Appointment } from "../services/appointmentService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  User,
  Home,
  FileText,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Image from "next/image";

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: Appointment["status"]) => void;
  onNotesUpdate: (id: string, notes: string) => void;
  isUpdating: boolean;
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onNotesUpdate,
  isUpdating = false,
}: AppointmentDetailsModalProps) {
  const [notes, setNotes] = useState(appointment.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  const handleSaveNotes = () => {
    onNotesUpdate(appointment.id!, notes);
    setIsEditingNotes(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{appointment.property_title || "Property Viewing"}</span>
            <Badge
              className={`${getStatusColor(
                appointment.status
              )} capitalize ml-2`}
            >
              {appointment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {appointment.property_image && (
            <div className="relative h-40 w-full rounded-md overflow-hidden">
              <Image
                src={appointment.property_image}
                alt={appointment.property_title || "Property"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Property</h4>
              </div>
              <p className="text-sm pl-6">{appointment.property_title}</p>
              {appointment.property_address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm">{appointment.property_address}</p>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Date & Time</h4>
              </div>
              <p className="text-sm pl-6">
                {formatDate(appointment.appointment_date)}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p>{formatTime(appointment.appointment_date)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Client Information</h4>
            </div>
            <p className="text-sm pl-6">{appointment.client_name}</p>

            {appointment.client_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p>{appointment.client_email}</p>
              </div>
            )}

            {appointment.client_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p>{appointment.client_phone}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Notes</h4>

              {!isEditingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 ml-auto"
                  onClick={() => setIsEditingNotes(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this appointment..."
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNotes(appointment.notes || "");
                      setIsEditingNotes(false);
                    }}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Notes"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm pl-6 whitespace-pre-wrap">
                {appointment.notes || "No notes added yet."}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2 sm:gap-0">
          {appointment.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => onStatusChange(appointment.id!, "confirmed")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-red-600"
                onClick={() => onStatusChange(appointment.id!, "cancelled")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Cancel Appointment
              </Button>
            </>
          )}

          {appointment.status === "confirmed" && (
            <>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => onStatusChange(appointment.id!, "completed")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Mark as Completed
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none text-red-600"
                onClick={() => onStatusChange(appointment.id!, "cancelled")}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Cancel Appointment
              </Button>
            </>
          )}

          {(appointment.status === "cancelled" ||
            appointment.status === "completed") && (
            <Button
              variant="outline"
              onClick={() => onStatusChange(appointment.id!, "pending")}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Reopen Appointment
            </Button>
          )}

          <Button variant="outline" onClick={onClose} className="ml-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
