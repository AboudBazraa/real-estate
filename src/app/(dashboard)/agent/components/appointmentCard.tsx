"use client";

import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Clock, Home, MapPin, User, Phone } from "lucide-react";
import { Appointment } from "../services/appointmentService";
import Image from "next/image";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: (appointment: Appointment) => void;
  showActions?: boolean;
  onStatusChange?: (id: string, status: Appointment["status"]) => void;
  isLoading?: boolean;
}

export function AppointmentCard({
  appointment,
  onClick,
  showActions = false,
  onStatusChange,
  isLoading = false,
}: AppointmentCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
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

  return (
    <Card
      className={`hover:shadow-md transition-shadow overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
      onClick={() => onClick && onClick(appointment)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {appointment.property_image && (
            <div className="relative h-32 sm:h-auto sm:w-1/4">
              <div className="absolute inset-0">
                <Image
                  src={appointment.property_image}
                  alt={appointment.property_title || "Property"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div
            className={`p-4 flex-1 ${
              appointment.property_image ? "sm:w-3/4" : "w-full"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <div>
                <h3 className="font-medium text-base line-clamp-1">
                  {appointment.property_title || "Property Viewing"}
                </h3>

                {appointment.property_address && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">
                      {appointment.property_address}
                    </span>
                  </div>
                )}
              </div>

              <Badge
                className={`${getStatusColor(
                  appointment.status
                )} capitalize self-start shrink-0`}
              >
                {appointment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-3">
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatDate(appointment.appointment_date)}</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{formatTime(appointment.appointment_date)}</span>
              </div>

              <div className="flex items-center gap-1 text-sm">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="line-clamp-1">{appointment.client_name}</span>
              </div>

              {appointment.client_phone && (
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{appointment.client_phone}</span>
                </div>
              )}
            </div>

            {appointment.notes && (
              <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-sm text-sm line-clamp-2">
                {appointment.notes}
              </div>
            )}

            {showActions && onStatusChange && (
              <div className="mt-4 flex flex-wrap gap-2">
                {appointment.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(appointment.id!, "confirmed");
                      }}
                      disabled={isLoading}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(appointment.id!, "cancelled");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {appointment.status === "confirmed" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(appointment.id!, "completed");
                      }}
                      disabled={isLoading}
                    >
                      Mark Completed
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(appointment.id!, "cancelled");
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {(appointment.status === "cancelled" ||
                  appointment.status === "completed") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStatusChange(appointment.id!, "pending");
                    }}
                    disabled={isLoading}
                  >
                    Reopen
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
