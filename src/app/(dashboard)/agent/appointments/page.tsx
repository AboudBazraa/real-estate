"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Calendar as CalendarIcon, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import {
  Appointment,
  getAgentAppointments,
  updateAppointmentStatus,
  addAppointmentNotes,
  createAppointment,
} from "../services/appointmentService";
import { AppointmentCard } from "../components/appointmentCard";
import { AppointmentDetailsModal } from "../components/AppointmentDetailsModal";
import { CreateAppointmentModal } from "../components/CreateAppointmentModal";
import { AppointmentSuccessMessage } from "../components/AppointmentSuccessMessage";
import { Badge } from "@/shared/components/ui/badge";
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isThisWeek,
  isBefore,
} from "date-fns";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const { toast } = useToast();
  const { supabase, user } = useSupabase();
  const router = useRouter();

  // Fetch agent properties
  useEffect(() => {
    async function fetchProperties() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("id, title, address")
          .eq("agent_id", user.id);

        if (error) throw error;
        setProperties(data || []);
      } catch (error: any) {
        console.error("Error fetching properties:", error.message);
        toast({
          title: "Error fetching properties",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    fetchProperties();
  }, [supabase, user, toast]);

  // Fetch appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await getAgentAppointments(supabase, user.id);
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error: any) {
        console.error("Error fetching appointments:", error.message);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAppointments();
  }, [supabase, user, toast]);

  // Filter appointments based on search term, status, and tab
  useEffect(() => {
    if (!appointments.length) return;

    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.property_title?.toLowerCase().includes(term) ||
          apt.client_name.toLowerCase().includes(term) ||
          apt.property_address?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [searchTerm, statusFilter, appointments]);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleStatusChange = async (
    id: string,
    status: Appointment["status"]
  ) => {
    setIsProcessing(true);
    try {
      const updatedAppointment = await updateAppointmentStatus(
        supabase,
        id,
        status
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );

      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, status });
      }

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${status}`,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    setIsProcessing(true);
    try {
      const updatedAppointment = await addAppointmentNotes(supabase, id, notes);

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, notes } : apt))
      );

      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment({ ...selectedAppointment, notes });
      }

      toast({
        title: "Notes Updated",
        description: "Appointment notes have been updated",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error updating notes:", error.message);
      toast({
        title: "Error",
        description: "Failed to update appointment notes",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAppointment = async (
    data: Omit<Appointment, "id" | "created_at" | "updated_at">
  ) => {
    setIsProcessing(true);
    try {
      const newAppointment = await createAppointment(supabase, data);

      // Update local state
      setAppointments((prev) => [...prev, newAppointment]);

      // Show success message
      setCreatedAppointment(newAppointment);
      setShowCreateModal(false);
      setShowSuccessMessage(true);

      toast({
        title: "Success",
        description: "New appointment scheduled successfully",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error creating appointment:", error.message);
      toast({
        title: "Error",
        description: "Failed to create appointment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Group appointments by date
  const getGroupedAppointments = (appointments: Appointment[]) => {
    const groups: { [key: string]: Appointment[] } = {};

    appointments.forEach((apt) => {
      const date = apt.appointment_date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(apt);
    });

    // Sort dates
    return Object.keys(groups)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        appointments: groups[date],
      }));
  };

  const formatGroupDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      if (isThisWeek(date)) return format(date, "EEEE"); // Day name
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getPendingCount = () => {
    return appointments.filter((apt) => apt.status === "pending").length;
  };

  const tabContent = (filter: string | null) => {
    let filtered = [...filteredAppointments];
    const today = new Date().toISOString().split("T")[0];

    if (filter === "today") {
      filtered = filtered.filter((apt) => apt.appointment_date === today);
    } else if (filter === "upcoming") {
      filtered = filtered.filter(
        (apt) =>
          apt.appointment_date >= today &&
          apt.status !== "cancelled" &&
          apt.status !== "completed"
      );
    } else if (filter === "past") {
      filtered = filtered.filter(
        (apt) =>
          apt.appointment_date < today ||
          apt.status === "cancelled" ||
          apt.status === "completed"
      );
    }

    const groupedAppointments = getGroupedAppointments(filtered);

    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-pulse space-y-4 w-full max-w-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-800 h-24 rounded-md"
              />
            ))}
          </div>
        </div>
      );
    }

    if (groupedAppointments.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px] p-6">
            <p className="text-slate-500 mb-4">No appointments found</p>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule New Appointment
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {groupedAppointments.map((group) => (
          <div key={group.date} className="space-y-3">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
              <h3 className="font-medium text-sm">
                {formatGroupDate(group.date)}
              </h3>
            </div>
            <div className="space-y-3">
              {group.appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onClick={handleAppointmentClick}
                  showActions
                  onStatusChange={handleStatusChange}
                  isLoading={isProcessing}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and schedule property viewings and client meetings
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter(null)}>
                All
              </TabsTrigger>
              <TabsTrigger value="today" onClick={() => setStatusFilter(null)}>
                Today
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                onClick={() => setStatusFilter(null)}
              >
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" onClick={() => setStatusFilter(null)}>
                Past
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search appointments..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`cursor-pointer capitalize ${
                    !statusFilter
                      ? "bg-slate-900"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  onClick={() => setStatusFilter(null)}
                >
                  All
                </Badge>
                <Badge
                  className={`cursor-pointer capitalize ${
                    statusFilter === "pending"
                      ? "bg-yellow-500"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending ({getPendingCount()})
                </Badge>
                <Badge
                  className={`cursor-pointer capitalize ${
                    statusFilter === "confirmed"
                      ? "bg-green-500"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  onClick={() => setStatusFilter("confirmed")}
                >
                  Confirmed
                </Badge>
                <Badge
                  className={`cursor-pointer capitalize ${
                    statusFilter === "completed"
                      ? "bg-blue-500"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  onClick={() => setStatusFilter("completed")}
                >
                  Completed
                </Badge>
                <Badge
                  className={`cursor-pointer capitalize ${
                    statusFilter === "cancelled"
                      ? "bg-red-500"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-200/80"
                  }`}
                  onClick={() => setStatusFilter("cancelled")}
                >
                  Cancelled
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <TabsContent value="all">{tabContent(null)}</TabsContent>
            <TabsContent value="today">{tabContent("today")}</TabsContent>
            <TabsContent value="upcoming">{tabContent("upcoming")}</TabsContent>
            <TabsContent value="past">{tabContent("past")}</TabsContent>
          </div>
        </Tabs>
      </div>

      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onStatusChange={handleStatusChange}
          onNotesUpdate={handleUpdateNotes}
          isUpdating={isProcessing}
        />
      )}

      {showCreateModal && (
        <CreateAppointmentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateAppointment={handleCreateAppointment}
          properties={properties}
          isLoading={isProcessing}
          agentId={user?.id || ""}
        />
      )}

      {showSuccessMessage && createdAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <AppointmentSuccessMessage
            appointment={createdAppointment}
            onClose={() => {
              setShowSuccessMessage(false);
              setShowCreateModal(true);
            }}
            onViewAppointments={() => {
              setShowSuccessMessage(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
