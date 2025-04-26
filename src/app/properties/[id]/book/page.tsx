"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isWeekend } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useToast } from "@/shared/hooks/use-toast";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { motion } from "framer-motion";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  address: string;
  agent_id: string;
  featured_image?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export default function BookPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  const { toast } = useToast();
  const { supabase, user } = useSupabase();
  const router = useRouter();

  // Generate available times between 9 AM and 5 PM
  const generateAvailableTimes = (date: Date | undefined) => {
    if (!date) return [];

    // Check if it's a weekend
    if (isWeekend(date)) {
      // Weekend hours: 10 AM to 3 PM
      const times = [];
      for (let hour = 10; hour < 15; hour++) {
        times.push(`${hour}:00` as never);
        times.push(`${hour}:30` as never);
      }
      return times;
    } else {
      // Weekday hours: 9 AM to 5 PM
      const times = [];
      for (let hour = 9; hour < 17; hour++) {
        times.push(`${hour}:00` as never);
        times.push(`${hour}:30` as never);
      }
      return times;
    }
  };

  // Fetch property details
  useEffect(() => {
    async function fetchProperty() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error: any) {
        console.error("Error fetching property:", error.message);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        router.push("/properties");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [supabase, id, toast, router]);

  // Update available times when date changes
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(generateAvailableTimes(selectedDate));
      setSelectedTime(""); // Reset selected time when date changes
    }
  }, [selectedDate]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.username || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !property) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse selected time into hours and minutes
      const [hour, minute] = selectedTime.split(":").map(Number);

      // Create a single date object with both date and time components
      const appointmentDateTime = new Date(selectedDate);
      appointmentDateTime.setHours(hour, minute, 0, 0);

      // Create appointment in database with combined date/time
      const appointmentData = {
        property_id: property.id,
        property_title: property.title,
        property_address: property.address,
        property_image: property.featured_image,
        agent_id: property.agent_id,
        user_id: user?.id || "",
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        appointment_date: appointmentDateTime.toISOString(),
        notes: formData.message,
        status: "pending",
        type: "showing",
      };

      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      setCreatedAppointment(data);
      setAppointmentSuccess(true);

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been submitted successfully",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error booking appointment:", error.message);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="h-96 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (appointmentSuccess && createdAppointment) {
    return (
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="text-center space-y-4">
            <div className="mx-auto bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>

            <h2 className="text-2xl font-bold">Appointment Requested!</h2>

            <p className="text-zinc-600 dark:text-zinc-400">
              Your appointment request has been submitted to the agent.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-left space-y-3">
              <h3 className="font-medium">{property?.title}</h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-zinc-500">Date: </span>
                  <span className="font-medium">
                    {format(
                      new Date(createdAppointment.appointment_date),
                      "MMMM dd, yyyy"
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Time: </span>
                  <span className="font-medium">
                    {format(
                      new Date(createdAppointment.appointment_date),
                      "h:mm a"
                    )}
                  </span>
                </p>
                <p>
                  <span className="text-zinc-500">Status: </span>
                  <span className="font-medium capitalize">
                    {createdAppointment.status}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-zinc-500">
              The agent will contact you to confirm the appointment.
              <br />
              You will receive an email confirmation at {formData.email}.
            </p>

            <div className="pt-4 space-y-2">
              <Button
                onClick={() => router.push(`/properties/${id}`)}
                className="w-full"
              >
                Return to Property
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/properties")}
                className="w-full"
              >
                Browse More Properties
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push(`/properties/${id}`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Property
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Book a Viewing
              </CardTitle>
              <CardDescription>
                Schedule an appointment to view this property
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Property Details
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      {property?.featured_image && (
                        <div className="relative h-40 md:h-auto md:w-1/3 rounded-md overflow-hidden">
                          <Image
                            src={property.featured_image}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-lg">
                          {property?.title}
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400">
                          {property?.address}
                        </p>
                        {property?.price && (
                          <p className="font-medium text-primary">
                            {property.price}
                          </p>
                        )}
                        <div className="flex gap-3 mt-2">
                          {property?.bedrooms && (
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {property.bedrooms} Bedrooms
                            </span>
                          )}
                          {property?.bathrooms && (
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
                              {property.bathrooms} Bathrooms
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">
                      Select a Date & Time
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <div className="border rounded-md p-2">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) =>
                              date < new Date() ||
                              date > addDays(new Date(), 30)
                            }
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Select
                          value={selectedTime}
                          onValueChange={setSelectedTime}
                          disabled={!selectedDate || isSubmitting}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTimes.map((time) => (
                              <SelectItem key={time} value={time}>
                                {format(
                                  new Date().setHours(
                                    parseInt(time.split(":")[0]),
                                    parseInt(time.split(":")[1])
                                  ),
                                  "h:mm a"
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selectedDate && (
                          <div className="flex items-center mt-3 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {format(selectedDate, "MMMM d, yyyy")}
                              </span>
                            </div>
                            {selectedTime && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>
                                  {format(
                                    new Date().setHours(
                                      parseInt(selectedTime.split(":")[0]),
                                      parseInt(selectedTime.split(":")[1])
                                    ),
                                    "h:mm a"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">
                      Your Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="Your phone number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message (optional)</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Any specific questions or requirements for your visit"
                          className="min-h-[100px]"
                          value={formData.message}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className="flex justify-end px-0">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Appointment"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Appointment Request</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Once submitted, your appointment request will be sent to the
                  property agent who will confirm your booking.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Confirmation</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  You will receive an email confirmation once the agent approves
                  your appointment.
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-1">At the Property</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  The agent will meet you at the property address at the
                  scheduled time to show you around.
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-1">Need Help?</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  For any questions about scheduling a viewing, please contact
                  our support team.
                </p>
                <Button variant="outline" className="w-full mt-3">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
