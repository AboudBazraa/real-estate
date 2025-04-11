import { SupabaseClient } from "@supabase/supabase-js";

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  totalViews: number;
  newInquiries: number;
  recentProperties: any[];
  upcomingAppointments: any[];
  recentActivity: any[];
  isLoading: boolean;
}

export const fetchDashboardStats = async (
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardStats> => {
  try {
    // Fetch all properties for this agent
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (propertiesError) throw propertiesError;

    // Get available properties (status = 'available' or 'for_sale' or 'for_rent')
    const availableProperties =
      properties?.filter((prop) => prop.featured === true) || [];

    // Fetch recent properties (last 5)
    const recentProperties = properties?.slice(0, 5) || [];

    // Fetch property details with images
    const recentPropertiesWithImages = await Promise.all(
      recentProperties.map(async (property) => {
        // Get primary image for each property
        const { data: images } = await supabase
          .from("property_images")
          .select("*")
          .eq("property_id", property.id)
          .eq("is_primary", true)
          .limit(1);

        const primaryImage =
          images && images.length > 0 ? images[0].image_url : null;

        return { ...property, primaryImage };
      })
    );

    // TODO: In a real implementation, we would have these tables
    // For demonstration, we'll return mock data for these
    const mockAppointments = [
      {
        id: "1",
        property_id: recentProperties[0]?.id || "prop-1",
        property_title: recentProperties[0]?.title || "Property viewing",
        client_name: "John Smith",
        date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
        time: "14:00",
        status: "confirmed",
      },
      {
        id: "2",
        property_id: recentProperties[1]?.id || "prop-2",
        property_title: recentProperties[1]?.title || "Property discussion",
        client_name: "Sarah Johnson",
        date: new Date(Date.now() + 86400000 * 2).toISOString(), // day after tomorrow
        time: "10:30",
        status: "pending",
      },
    ];

    const mockActivity = [
      {
        id: "1",
        type: "new_inquiry",
        message: "New inquiry received for property",
        property_id: recentProperties[0]?.id,
        property_title: recentProperties[0]?.title || "Unknown property",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
      {
        id: "2",
        type: "property_viewed",
        message: "Property page viewed 5 times today",
        property_id: recentProperties[1]?.id,
        property_title: recentProperties[1]?.title || "Unknown property",
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      },
      {
        id: "3",
        type: "price_update",
        message: "You updated the price",
        property_id: recentProperties[2]?.id,
        property_title: recentProperties[2]?.title || "Unknown property",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
    ];

    return {
      totalProperties: properties?.length || 0,
      availableProperties: availableProperties.length,
      totalViews: 127, // Placeholder value
      newInquiries: 5, // Placeholder value
      recentProperties: recentPropertiesWithImages,
      upcomingAppointments: mockAppointments,
      recentActivity: mockActivity,
      isLoading: false,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// This function would fetch detailed analytics data for the agent dashboard
export const fetchAgentAnalytics = async (
  supabase: SupabaseClient,
  userId: string,
  timeframe: "week" | "month" | "year" = "month"
) => {
  try {
    // In a real implementation, this would query analytics tables
    // For now, return mock data
    return {
      propertyViews: {
        total: 427,
        change: 12.4, // percentage increase from previous period
        data: [21, 35, 45, 32, 54, 62, 43, 36, 48, 52, 64, 58],
      },
      inquiries: {
        total: 25,
        change: 8.7,
        data: [2, 3, 4, 2, 1, 3, 2, 1, 3, 2, 1, 1],
      },
      favorites: {
        total: 68,
        change: 5.2,
        data: [5, 7, 6, 4, 8, 5, 7, 6, 5, 6, 4, 5],
      },
      conversions: {
        total: 3,
        change: -2.1, // negative percentage indicates decrease
        data: [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
      },
    };
  } catch (error) {
    console.error("Error fetching agent analytics:", error);
    throw error;
  }
};

// This would handle creating a new appointment
export const createAppointment = async (
  supabase: SupabaseClient,
  appointmentData: {
    property_id: string;
    client_name: string;
    client_email: string;
    client_phone?: string;
    date: string;
    time: string;
    notes?: string;
  }
) => {
  try {
    // In a real implementation, insert into appointments table
    console.log("Creating appointment:", appointmentData);
    return { success: true, id: "mock-appointment-id" };
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// This would handle updating property status
export const updatePropertyStatus = async (
  supabase: SupabaseClient,
  propertyId: string,
  newStatus: string,
  userId: string
) => {
  try {
    // First verify the user owns this property
    const { data: property, error: fetchError } = await supabase
      .from("properties")
      .select("user_id")
      .eq("id", propertyId)
      .single();

    if (fetchError) throw fetchError;

    if (property.user_id !== userId) {
      throw new Error("You do not have permission to update this property");
    }

    // Update the property status
    const { data, error } = await supabase
      .from("properties")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", propertyId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error updating property status:", error);
    throw error;
  }
};
