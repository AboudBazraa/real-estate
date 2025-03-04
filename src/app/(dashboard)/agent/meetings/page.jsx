import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import AppointmentCard from "@/app/(dashboard)/agent/components/appointmentCard"
import { Plus, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

const appointments = [
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
]

const ScheduledVisitsPage = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Appointments & Meetings</h1>
            <p className="text-muted-foreground">Manage your scheduled property viewings and client meetings</p>
          </div>
        <Button>
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
            <Input type="search" placeholder="Search appointments..." className="pl-8" />
          </div>
        </div>

        <TabsContent value="upcoming" className="pt-4">
          <UpcomingAppointments appointments={appointments} />
        </TabsContent>

        <TabsContent value="past" className="pt-4">
          <PastAppointments />
        </TabsContent>

        <TabsContent value="all" className="pt-4">
          <AllAppointments />
        </TabsContent>
      </Tabs>
    </div>
  )
}

const UpcomingAppointments = ({ appointments }) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.slice(0, 2).map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.slice(2).map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </CardContent>
    </Card>
  </>
)

const PastAppointments = () => (
  <Card>
    <CardContent className="p-6">
      <EmptyState message="Past appointments will be displayed here" buttonText="View Archive" />
    </CardContent>
  </Card>
)

const AllAppointments = () => (
  <Card>
    <CardContent className="p-6">
      <EmptyState message="All appointments history will be displayed here" buttonText="View All Records" />
    </CardContent>
  </Card>
)


const EmptyState = ({ message, buttonText }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 text-center">
    <p className="text-sm text-muted-foreground">{message}</p>
    <Button variant="outline" size="sm">
      {buttonText}
    </Button>
  </div>
)


export default ScheduledVisitsPage
