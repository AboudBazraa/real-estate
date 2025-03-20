"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  Home,
  ListFilter,
  MessageSquareText,
  Plus,
  Eye,
  ArrowRight,
  Check,
  TrendingUp,
  TrendingDown,
  Activity,
  Edit,
  Trash2,
  Mail,
  CreditCard,
  Circle,
  ChevronRight,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Components
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

// Providers & Hooks
import { useUser } from "@/shared/providers/UserProvider";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useProperties } from "@/shared/hooks/useProperties";

// Services
import {
  DashboardStats,
  fetchDashboardStats,
} from "./services/dashboardService";

// Utils
import {
  formatCurrency,
  formatDate,
  timeAgo,
} from "@/shared/utils/property-util";

// Extend the DashboardStats interface to include additional properties
interface ExtendedDashboardStats extends DashboardStats {
  availablePercentage: number;
  scheduledViewings: number;
}

// Skeleton components for loading states
const DashboardSkeleton = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[200px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-[90px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-[70px]" />
              </CardContent>
            </Card>
          ))}
      </div>
      <Skeleton className="h-10 w-[300px]" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent>
            <RecentPropertiesSkeleton />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-[180px]" />
          </CardHeader>
          <CardContent>
            <AppointmentsSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RecentPropertiesSkeleton = () => (
  <div className="space-y-6">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="flex">
              <Skeleton className="h-4 w-[60px] mr-3" />
              <Skeleton className="h-4 w-[40px] mr-3" />
              <Skeleton className="h-4 w-[40px]" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[60px]" />
            <Skeleton className="h-9 w-[60px]" />
          </div>
        </div>
      ))}
  </div>
);

const AppointmentsSkeleton = () => (
  <div className="space-y-6">
    {Array(2)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-[180px]" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      ))}
  </div>
);

const ActivitySkeleton = () => (
  <div className="space-y-6">
    {Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      ))}
  </div>
);

// Add getAgentStats function or modify existing one
async function getAgentStats(supabase, userId) {
  const stats = {
    totalMeetings: 0,
    pendingRequests: 0,
    completedDeals: 0,
    propertyCount: 0,
  };

  try {
    // Get meetings count
    const { data: meetings, error: meetingsError } = await supabase
      .from("meetings")
      .select("*", { count: "exact" })
      .eq("agent_id", userId);

    if (!meetingsError) {
      stats.totalMeetings = meetings?.length || 0;
    }

    // Get pending requests count
    const { data: requests, error: requestsError } = await supabase
      .from("agent_requests")
      .select("*", { count: "exact" })
      .eq("agent_id", userId)
      .eq("status", "pending");

    if (!requestsError) {
      stats.pendingRequests = requests?.length || 0;
    }

    // Get completed deals count
    const { data: deals, error: dealsError } = await supabase
      .from("agent_deals")
      .select("*", { count: "exact" })
      .eq("agent_id", userId)
      .eq("status", "completed");

    if (!dealsError) {
      stats.completedDeals = deals?.length || 0;
    }

    // Get property count
    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("*", { count: "exact" })
      .eq("agent_id", userId);

    if (!propertiesError) {
      stats.propertyCount = properties?.length || 0;
    }

    return stats;
  } catch (error) {
    console.error("Error fetching agent stats:", error);
    return stats;
  }
}

export default function AgentDashboard() {
  const { user, isLoading: userLoading } = useUser();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();
  const { deleteProperty } = useProperties();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ExtendedDashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    totalViews: 0,
    newInquiries: 0,
    recentProperties: [],
    upcomingAppointments: [],
    recentActivity: [],
    isLoading: true,
    availablePercentage: 0,
    scheduledViewings: 0,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (userLoading || !user) return;

      try {
        setIsLoading(true);
        const dashboardStats = await fetchDashboardStats(supabase, user.id);
        const { data: propertyCount, error: propertyError } = await supabase
          .from("properties")
          .select("id")
          .eq("agent_id", user.id);

        if (propertyError) {
          console.error("Error fetching properties:", propertyError);
        }

        setStats({
          ...dashboardStats,
          availablePercentage: 0,
          scheduledViewings: dashboardStats.upcomingAppointments.length,
          totalProperties: propertyCount?.length || 0,
        });
      } catch (error: any) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [supabase, user, userLoading, toast]);

  const handleDeleteProperty = (propertyId) => {
    setPropertyToDelete(propertyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteProperty(propertyToDelete);

      if (result) {
        // Update local state to remove the deleted property
        setStats((prevStats) => ({
          ...prevStats,
          totalProperties: prevStats.totalProperties - 1,
          recentProperties: prevStats.recentProperties.filter(
            (property) => property.id !== propertyToDelete
          ),
        }));

        toast({
          title: "Success",
          description: "Property deleted successfully",
        });
      }
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };

  // Show loading state
  if (userLoading) {
    return <DashboardSkeleton />;
  }

  // If user not loaded or not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              You need to be logged in to access the agent dashboard.
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/agent/addNewProp">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Properties
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    stats.totalProperties
                  )}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Link
                href="/agent/agentProperties"
                className="text-blue-600 font-medium hover:underline flex items-center"
              >
                View all properties
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Available Properties
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    stats.availableProperties
                  )}
                </h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div
                className={
                  stats.availablePercentage >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
                title="Compared to last month"
              >
                <span className="font-medium flex items-center">
                  {stats.availablePercentage >= 0 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(stats.availablePercentage)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600">
                  Scheduled Viewings
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    stats.scheduledViewings
                  )}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Link
                href="/agent/meetings"
                className="text-amber-600 font-medium hover:underline flex items-center"
              >
                View schedule
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  New Inquiries
                </p>
                <h3 className="text-3xl font-bold mt-1">
                  {isLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    stats.newInquiries
                  )}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <MessageSquareText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Link
                href="/agent/request"
                className="text-purple-600 font-medium hover:underline flex items-center"
              >
                View inquiries
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalProperties || 0}
            </div>
            <p className="text-xs text-muted-foreground">Listed properties</p>
          </CardContent>
          <CardFooter>
            <Link href="/agent/agentProperties" className="w-full">
              <Button variant="outline" className="w-full">
                <span>Manage Properties</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Properties & Activity Section */}
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-7 md:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recent Properties</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/agent/agentProperties" className="text-sm">
                View all
              </Link>
            </Button>
          </div>

          {/* Recent Properties List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats.recentProperties.length === 0 ? (
            <Card className="p-6 text-center border-dashed">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-3 bg-blue-100 rounded-full mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">No properties yet</h3>
                <p className="text-gray-500 mb-4">
                  Add your first property to see it here
                </p>
                <Button asChild>
                  <Link href="/agent/addNewProp">
                    <Plus className="mr-2 h-4 w-4" /> Add Property
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.recentProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative h-48">
                    {property.primaryImage ? (
                      <Image
                        src={property.primaryImage}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">{property.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {formatCurrency(property.price)}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/agent/properties/edit/${property.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/agent/properties/${property.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-7 md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/agent/meetings" className="text-sm">
                View all
              </Link>
            </Button>
          </div>

          {/* Upcoming Appointments List */}
          {isLoading ? (
            <AppointmentsSkeleton />
          ) : stats.upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">
                          {appointment.property_title}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span>
                            {formatDate(appointment.date)} at {appointment.time}
                          </span>
                          <span className="capitalize">
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          With {appointment.client_name}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed">
              <div className="flex flex-col items-center justify-center py-6">
                <div className="p-3 bg-amber-100 rounded-full mb-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-gray-500">
                  Your scheduled appointments will appear here
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ActivitySkeleton />
            ) : stats.recentActivity.length > 0 ? (
              <div className="space-y-6">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      {activity.type === "new_inquiry" ? (
                        <MessageSquareText className="h-4 w-4 text-primary" />
                      ) : activity.type === "property_viewed" ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <Building2 className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{activity.message}</p>
                        <span className="text-sm text-muted-foreground">
                          {timeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activity.property_title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MessageSquareText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No recent activity</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Recent property activity will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
