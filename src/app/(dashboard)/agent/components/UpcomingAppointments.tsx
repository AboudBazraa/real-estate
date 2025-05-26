"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatDate } from "@/shared/utils/property-utils";

export interface Appointment {
  id: string;
  property_id: string;
  property_title: string;
  client_name: string;
  date: string;
  time: string;
  status: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  isLoading: boolean;
  translations?: {
    upcomingAppointments: string;
    viewAll: string;
    with: string;
    viewDetails: string;
    noUpcomingAppointments: string;
    scheduledAppointmentsWillAppear: string;
  };
  isRTL?: boolean;
}

export function UpcomingAppointments({
  appointments,
  isLoading,
  translations,
  isRTL = false,
}: UpcomingAppointmentsProps) {
  const t = translations || {
    upcomingAppointments: "Upcoming Appointments",
    viewAll: "View all",
    with: "With",
    viewDetails: "View Details",
    noUpcomingAppointments: "No upcoming appointments",
    scheduledAppointmentsWillAppear:
      "Your scheduled appointments will appear here",
  };

  return (
    <div className={`space-y-4 ${isRTL ? "rtl" : ""}`}>
      <div
        className={`flex items-center justify-between ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h3 className="text-xl font-semibold">{t.upcomingAppointments}</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/agent/meetings" className="text-sm">
            {t.viewAll}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <AppointmentsSkeleton />
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className={`hover:shadow-md transition-shadow p-1 ${
                isRTL ? "rtl" : ""
              }`}
            >
              <CardContent className="p-4">
                <div
                  className={`flex items-start gap-4 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="rounded-full bg-primary/10 p-2 mt-1">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div
                    className={`flex-1 space-y-1 ${isRTL ? "text-right" : ""}`}
                  >
                    <p className="font-medium line-clamp-1">
                      {appointment.property_title}
                    </p>
                    <div
                      className={`flex flex-wrap justify-between text-sm gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Calendar
                          className={`h-3.5 w-3.5 ${
                            isRTL ? "ml-1" : "mr-1"
                          } text-muted-foreground`}
                        />
                        {formatDate(appointment.date)}
                      </span>
                      <span
                        className={`flex items-center ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Clock
                          className={`h-3.5 w-3.5 ${
                            isRTL ? "ml-1" : "mr-1"
                          } text-muted-foreground`}
                        />
                        {appointment.time}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-primary/10 text-primary">
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.with} {appointment.client_name}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex ${
                    isRTL ? "justify-start" : "justify-end"
                  } mt-3`}
                >
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/agent/meetings/${appointment.id}`}>
                      {t.viewDetails}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className={`p-6 text-center border-dashed ${isRTL ? "rtl" : ""}`}>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="p-3 bg-amber-100 rounded-full mb-3">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {t.noUpcomingAppointments}
            </h3>
            <p className="text-gray-500">{t.scheduledAppointmentsWillAppear}</p>
          </div>
        </Card>
      )}
    </div>
  );
}

const AppointmentsSkeleton = () => (
  <div className="space-y-4">
    {[...Array(2)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-[180px]" />
              <div className="flex justify-between gap-2">
                <Skeleton className="h-4 w-[90px]" />
                <Skeleton className="h-4 w-[60px]" />
                <Skeleton className="h-4 w-[70px]" />
              </div>
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
