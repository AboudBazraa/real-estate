"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Appointment } from "../services/appointmentService";
import { Loader2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
  address: string;
}

// Create a custom form type for the form inputs
interface AppointmentFormData {
  property_id: string;
  date: string; // Date only
  time: string; // Time only
  client_name: string;
  client_email: string;
  client_phone?: string;
  type: "showing" | "inspection" | "meeting" | "other";
  notes?: string;
}

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAppointment: (
    data: Omit<Appointment, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  properties: Property[];
  isLoading: boolean;
  agentId: string;
  userId?: string;
  defaultPropertyId?: string;
}

export function CreateAppointmentModal({
  isOpen,
  onClose,
  onCreateAppointment,
  properties,
  isLoading,
  agentId,
  userId = "",
  defaultPropertyId,
}: CreateAppointmentModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // Set default property when modal opens
  useEffect(() => {
    if (isOpen && defaultPropertyId) {
      const property = properties.find((p) => p.id === defaultPropertyId);
      if (property) {
        setSelectedProperty(property);
        setValue("property_id", property.id);
      }
    }
  }, [isOpen, defaultPropertyId, properties, setValue]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedProperty(null);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    // Combine date and time into a single ISO timestamp
    const dateTime = new Date(`${data.date}T${data.time}`);

    // Format data and add required fields
    const appointmentData: Omit<
      Appointment,
      "id" | "created_at" | "updated_at"
    > = {
      property_id: data.property_id,
      agent_id: agentId,
      user_id: userId || "",
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      appointment_date: dateTime.toISOString(),
      status: "pending" as const,
      type: data.type,
      notes: data.notes,
      // Add property info for display before DB join
      property_title: selectedProperty?.title,
      property_address: selectedProperty?.address,
    };

    await onCreateAppointment(appointmentData);
  };

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setValue("property_id", property.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="property_id">Property</Label>
            <Select
              onValueChange={handlePropertyChange}
              defaultValue={defaultPropertyId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property_id && (
              <p className="text-xs text-red-500">Property is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date", { required: true })}
                disabled={isLoading}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <p className="text-xs text-red-500">Date is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                {...register("time", { required: true })}
                disabled={isLoading}
              />
              {errors.time && (
                <p className="text-xs text-red-500">Time is required</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Appointment Type</Label>
            <Select
              onValueChange={(value) => setValue("type", value as any)}
              defaultValue="showing"
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="showing">Showing</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("type", { required: true })} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_name">Client Name</Label>
            <Input
              id="client_name"
              {...register("client_name", { required: true })}
              placeholder="John Doe"
              disabled={isLoading}
            />
            {errors.client_name && (
              <p className="text-xs text-red-500">Client name is required</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                {...register("client_email", { required: true })}
                placeholder="client@example.com"
                disabled={isLoading}
              />
              {errors.client_email && (
                <p className="text-xs text-red-500">Valid email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone">Client Phone</Label>
              <Input
                id="client_phone"
                {...register("client_phone")}
                placeholder="(123) 456-7890"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add any additional information..."
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Schedule Appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
