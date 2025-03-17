"use client";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card";
import AppointmentCard from "@/app/(dashboard)/agent/components/appointmentCard";
import { Plus, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";

const initialAppointments = [
  {
    id: "apt-1",
    propertyTitle: "Modern Apartment in Downtown",
    propertyAddress: "123 Main St, Downtown, City",
    clientName: "John Smith",
    clientPhone: "(555) 123-4567",
    date: "2025-03-05",
    time: "10:00 AM",
    type: "Showing",
    status: "Confirmed",
  },
  {
    id: "apt-2",
    propertyTitle: "Luxury Villa with Pool",
    propertyAddress: "456 Ocean Ave, Beachside, City",
    clientName: "Emma Johnson",
    clientPhone: "(555) 987-6543",
    date: "2025-03-05",
    time: "2:30 PM",
    type: "Showing",
    status: "Confirmed",
  },
  {
    id: "apt-3",
    propertyTitle: "Family Home with Garden",
    propertyAddress: "101 Suburban Lane, Greenfield, City",
    clientName: "Michael Brown",
    clientPhone: "(555) 456-7890",
    date: "2025-03-06",
    time: "11:15 AM",
    type: "Inspection",
    status: "Pending",
  },
  {
    id: "apt-4",
    propertyTitle: "Office Meeting",
    propertyAddress: "789 Business Blvd, Downtown, City",
    clientName: "Sarah Wilson",
    clientPhone: "(555) 234-5678",
    date: "2025-03-07",
    time: "9:00 AM",
    type: "Meeting",
    status: "Confirmed",
  },
];

const ScheduledVisitsPage = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    propertyTitle: "",
    propertyAddress: "",
    clientName: "",
    clientPhone: "",
    date: "",
    time: "",
    type: "Showing",
    status: "Pending",
  });
  const { toast } = useToast();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleAddAppointment = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAppointment({
      propertyTitle: "",
      propertyAddress: "",
      clientName: "",
      clientPhone: "",
      date: "",
      time: "",
      type: "Showing",
      status: "Pending",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const appointmentToAdd = {
      ...newAppointment,
      id: `apt-${appointments.length + 1}`,
    };
    setAppointments((prev) => [...prev, appointmentToAdd]);
    toast({
      title: "Appointment Added",
      description: "You have successfully added a new appointment.",
    });
    handleModalClose();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Appointments & Meetings
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled property viewings and client meetings
          </p>
        </div>
        <Button onClick={handleAddAppointment}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="relative sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <TabsContent value="upcoming" className="pt-4">
          <UpcomingAppointments
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
          />
        </TabsContent>

        <TabsContent value="past" className="pt-4">
          <PastAppointments />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <AllAppointments />
        </TabsContent>
      </Tabs>

      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold">Add New Appointment</h2>
            <Input
              name="propertyTitle"
              placeholder="Property Title"
              value={newAppointment.propertyTitle}
              onChange={handleInputChange}
              required
            />
            <Input
              name="propertyAddress"
              placeholder="Property Address"
              value={newAppointment.propertyAddress}
              onChange={handleInputChange}
              required
            />
            <Input
              name="clientName"
              placeholder="Client Name"
              value={newAppointment.clientName}
              onChange={handleInputChange}
              required
            />
            <Input
              name="clientPhone"
              placeholder="Client Phone"
              value={newAppointment.clientPhone}
              onChange={handleInputChange}
              required
            />
            <Input
              name="date"
              type="date"
              value={newAppointment.date}
              onChange={handleInputChange}
              required
            />
            <Input
              name="time"
              type="time"
              value={newAppointment.time}
              onChange={handleInputChange}
              required
            />
            <select
              name="type"
              value={newAppointment.type}
              onChange={handleInputChange}
              className="w-full"
            >
              <option value="Showing">Showing</option>
              <option value="Inspection">Inspection</option>
              <option value="Meeting">Meeting</option>
            </select>
            <Button type="submit">Add Appointment</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const UpcomingAppointments = ({ appointments, onAppointmentClick }) => (
  <Card>
    <CardHeader>
      <CardTitle>Today's Schedule</CardTitle>
    </CardHeader>
    <CardContent>
      {appointments.slice(0, 2).map((appointment) => (
        <div
          key={appointment.id}
          onClick={() => onAppointmentClick(appointment)}
        >
          <AppointmentCard appointment={appointment} />
        </div>
      ))}
    </CardContent>
  </Card>
);

const PastAppointments = () => (
  <Card>
    <CardContent className="p-6">
      <EmptyState
        message="Past appointments will be displayed here"
        buttonText="View Archive"
      />
    </CardContent>
  </Card>
);

const AllAppointments = () => (
  <Card>
    <CardContent className="p-6">
      <EmptyState
        message="All appointments history will be displayed here"
        buttonText="View All Records"
      />
    </CardContent>
  </Card>
);

const AppointmentDetails = ({ appointment, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <Card className="w-96">
      <CardHeader>
        <CardTitle>{appointment.propertyTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Client Name:</strong> {appointment.clientName}
        </p>
        <p>
          <strong>Client Phone:</strong> {appointment.clientPhone}
        </p>
        <p>
          <strong>Date:</strong> {appointment.date}
        </p>
        <p>
          <strong>Time:</strong> {appointment.time}
        </p>
        <p>
          <strong>Type:</strong> {appointment.type}
        </p>
        <p>
          <strong>Status:</strong> {appointment.status}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  </div>
);

const Modal = ({ onClose, children }) => (
  <div className=" fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
    <Card className="w-96">
      <CardContent>
        {children}
        <Button onClick={onClose} className="absolute top-2 right-2">
          X
        </Button>
      </CardContent>
    </Card>
  </div>
);

const EmptyState = ({ message, buttonText }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-center">
    <p className="text-sm text-muted-foreground">{message}</p>
    <Button variant="outline" size="sm">
      {buttonText}
    </Button>
  </div>
);

export default ScheduledVisitsPage;
