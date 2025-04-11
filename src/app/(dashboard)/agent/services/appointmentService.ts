import { SupabaseClient } from "@supabase/supabase-js";

export interface Appointment {
  id?: string;
  property_id: string;
  property_title?: string;
  property_address?: string;
  property_image?: string;
  user_id: string;
  agent_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  appointment_date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  type: "showing" | "inspection" | "meeting" | "other";
}

// Fetch all appointments for an agent
export const getAgentAppointments = async (
  supabase: SupabaseClient,
  agentId: string,
  options?: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    propertyId?: string;
  }
) => {
  try {
    let query = supabase
      .from("appointments")
      .select(
        `
        *,
        properties:property_id (
          id,
          title,
          address
        )
      `
      )
      .eq("agent_id", agentId);

    // Apply filters
    if (options?.fromDate) {
      query = query.gte("appointment_date", options.fromDate);
    }

    if (options?.toDate) {
      query = query.lte("appointment_date", options.toDate);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.propertyId) {
      query = query.eq("property_id", options.propertyId);
    }

    const { data, error } = await query.order("appointment_date", {
      ascending: true,
    });

    if (error) throw error;

    // Get primary images for each property
    const appointmentWithImages = await Promise.all(
      data.map(async (appointment) => {
        let propertyImage = null;

        if (appointment.property_id) {
          // Try to get the primary image for the property
          const { data: images } = await supabase
            .from("property_images")
            .select("image_url")
            .eq("property_id", appointment.property_id)
            .eq("is_primary", true)
            .limit(1);

          if (images && images.length > 0) {
            propertyImage = images[0].image_url;
          } else {
            // If no primary image, try to get the first image
            const { data: firstImage } = await supabase
              .from("property_images")
              .select("image_url")
              .eq("property_id", appointment.property_id)
              .order("display_order", { ascending: true })
              .limit(1);

            if (firstImage && firstImage.length > 0) {
              propertyImage = firstImage[0].image_url;
            }
          }
        }

        // Extract time from the appointment_date which is likely a timestamptz
        let appointmentTime = "";
        if (appointment.appointment_date) {
          try {
            const dateObj = new Date(appointment.appointment_date);
            appointmentTime = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (e) {
            console.error("Error parsing date:", e);
          }
        }

        return {
          ...appointment,
          property_title: appointment.properties?.title,
          property_address: appointment.properties?.address,
          property_image: propertyImage,
          appointment_time: appointmentTime,
        };
      })
    );

    return appointmentWithImages;
  } catch (error) {
    console.error("Error fetching agent appointments:", error);
    throw error;
  }
};

// Fetch upcoming appointments for an agent (for dashboard)
export const getUpcomingAppointments = async (
  supabase: SupabaseClient,
  agentId: string,
  limit: number = 5
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        properties:property_id (
          id,
          title,
          address
        )
      `
      )
      .eq("agent_id", agentId)
      .gte("appointment_date", today)
      .not("status", "eq", "cancelled")
      .order("appointment_date", { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Get primary images for each property
    const appointmentWithImages = await Promise.all(
      data.map(async (appointment) => {
        let propertyImage = null;

        if (appointment.property_id) {
          // Try to get the primary image for the property
          const { data: images } = await supabase
            .from("property_images")
            .select("image_url")
            .eq("property_id", appointment.property_id)
            .eq("is_primary", true)
            .limit(1);

          if (images && images.length > 0) {
            propertyImage = images[0].image_url;
          } else {
            // If no primary image, try to get the first image
            const { data: firstImage } = await supabase
              .from("property_images")
              .select("image_url")
              .eq("property_id", appointment.property_id)
              .order("display_order", { ascending: true })
              .limit(1);

            if (firstImage && firstImage.length > 0) {
              propertyImage = firstImage[0].image_url;
            }
          }
        }

        // Extract time from the appointment_date which is likely a timestamptz
        let appointmentTime = "";
        if (appointment.appointment_date) {
          try {
            const dateObj = new Date(appointment.appointment_date);
            appointmentTime = dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } catch (e) {
            console.error("Error parsing date:", e);
          }
        }

        return {
          ...appointment,
          property_title: appointment.properties?.title,
          property_address: appointment.properties?.address,
          property_image: propertyImage,
          appointment_time: appointmentTime,
        };
      })
    );

    return appointmentWithImages;
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    throw error;
  }
};

// Get appointments for a specific property
export const getPropertyAppointments = async (
  supabase: SupabaseClient,
  propertyId: string
) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("property_id", propertyId)
      .order("appointment_date", { ascending: true });

    if (error) throw error;

    // Process each appointment to add appointment_time
    const processedData = data.map((appointment) => {
      // Extract time from the appointment_date which is likely a timestamptz
      let appointmentTime = "";
      if (appointment.appointment_date) {
        try {
          const dateObj = new Date(appointment.appointment_date);
          appointmentTime = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }

      return {
        ...appointment,
        appointment_time: appointmentTime,
      };
    });

    return processedData;
  } catch (error) {
    console.error("Error fetching property appointments:", error);
    throw error;
  }
};

// Get a single appointment by ID
export const getAppointmentById = async (
  supabase: SupabaseClient,
  appointmentId: string
) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        properties:property_id (
          id,
          title,
          address
        )
      `
      )
      .eq("id", appointmentId)
      .single();

    if (error) throw error;

    // Get property image
    let propertyImage = null;
    if (data.property_id) {
      // Try to get the primary image for the property
      const { data: images } = await supabase
        .from("property_images")
        .select("image_url")
        .eq("property_id", data.property_id)
        .eq("is_primary", true)
        .limit(1);

      if (images && images.length > 0) {
        propertyImage = images[0].image_url;
      } else {
        // If no primary image, try to get the first image
        const { data: firstImage } = await supabase
          .from("property_images")
          .select("image_url")
          .eq("property_id", data.property_id)
          .order("display_order", { ascending: true })
          .limit(1);

        if (firstImage && firstImage.length > 0) {
          propertyImage = firstImage[0].image_url;
        }
      }
    }

    // Extract time from the appointment_date which is likely a timestamptz
    let appointmentTime = "";
    if (data.appointment_date) {
      try {
        const dateObj = new Date(data.appointment_date);
        appointmentTime = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }

    return {
      ...data,
      property_title: data.properties?.title,
      property_address: data.properties?.address,
      property_image: propertyImage,
      appointment_time: appointmentTime,
    };
  } catch (error) {
    console.error(`Error fetching appointment ${appointmentId}:`, error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (
  supabase: SupabaseClient,
  appointmentData: Omit<
    Appointment,
    "id" | "created_at" | "updated_at" | "appointment_time"
  >
) => {
  try {
    // Omit appointment_time if it's passed since it doesn't exist in the database
    const { appointment_time, ...dataToInsert } = appointmentData as any;

    const { data, error } = await supabase
      .from("appointments")
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw error;

    // Add appointment_time to the returned data
    let appointmentTime = "";
    if (data.appointment_date) {
      try {
        const dateObj = new Date(data.appointment_date);
        appointmentTime = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }

    return {
      ...data,
      appointment_time: appointmentTime,
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update an appointment
export const updateAppointment = async (
  supabase: SupabaseClient,
  appointmentId: string,
  updates: Partial<Appointment>
) => {
  try {
    // Omit appointment_time if it's passed since it doesn't exist in the database
    const { appointment_time, ...dataToUpdate } = updates as any;

    const { data, error } = await supabase
      .from("appointments")
      .update({
        ...dataToUpdate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;

    // Add appointment_time to the returned data
    let appointmentTime = "";
    if (data.appointment_date) {
      try {
        const dateObj = new Date(data.appointment_date);
        appointmentTime = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }

    return {
      ...data,
      appointment_time: appointmentTime,
    };
  } catch (error) {
    console.error(`Error updating appointment ${appointmentId}:`, error);
    throw error;
  }
};

// Delete an appointment
export const deleteAppointment = async (
  supabase: SupabaseClient,
  appointmentId: string
) => {
  try {
    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting appointment ${appointmentId}:`, error);
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  supabase: SupabaseClient,
  appointmentId: string,
  status: Appointment["status"]
) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating appointment status ${appointmentId}:`, error);
    throw error;
  }
};

// Add notes to an appointment
export const addAppointmentNotes = async (
  supabase: SupabaseClient,
  appointmentId: string,
  notes: string
) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error adding notes to appointment ${appointmentId}:`, error);
    throw error;
  }
};
