import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"  // update this path to "@/shared/components/ui/button"  
import { Card, CardContent } from "@/shared/components/ui/card"  // update this path to "@/shared/components/ui/card"
import { Calendar, Clock, MapPin, User } from "lucide-react"  // update this path to "lucide-react"


interface AppointmentCardProps {
  appointment: {
    id: string
    propertyTitle: string
    propertyAddress: string
    clientName: string
    clientPhone: string
    date: string
    time: string
    type: string
    status: string
  }
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{appointment.propertyTitle}</h3>
              <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>{appointment.status}</Badge>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{appointment.propertyAddress}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span>
                {appointment.clientName} • {appointment.clientPhone}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-sm">
            <div className="grid place-items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{appointment.date}</span>
            </div>
            <div className="grid place-items-center gap-1">
              <Clock className="h-4 w-4 text-primary" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Reschedule
          </Button>
          <Button size="sm" className="flex-1">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

