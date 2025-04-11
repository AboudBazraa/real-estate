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
import { ScrollArea, ScrollBar } from "@/shared/components/ui/scroll-area";

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
} from "@/shared/utils/property-utils";

// New Dashboard Components
import { DashboardStats as DashboardStatsComponent } from "./components/DashboardStats";
import { RecentProperties } from "./components/RecentProperties";
import { UpcomingAppointments } from "./components/UpcomingAppointments";
import { RecentActivity } from "./components/RecentActivity";

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
        setStats({
          ...dashboardStats,
          availablePercentage: 3.5, // Example value for demo
          scheduledViewings: dashboardStats.upcomingAppointments.length,
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

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      const result = await deleteProperty(propertyId);

      if (result) {
        // Update local state to remove the deleted property
        setStats((prevStats) => ({
          ...prevStats,
          totalProperties: prevStats.totalProperties - 1,
          recentProperties: prevStats.recentProperties.filter(
            (property) => property.id !== propertyId
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
    }
  };

  // Show loading state
  if (userLoading) {
    return <DashboardSkeleton />;
  }

  // If user not loaded or not authenticated
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
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
    <div className="h-full flex-1 space-y-8 p-4">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your properties and appointments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/agent/addNewProp">
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStatsComponent
        totalProperties={stats.totalProperties}
        availableProperties={stats.availableProperties}
        scheduledViewings={stats.scheduledViewings}
        newInquiries={stats.newInquiries}
        availablePercentage={stats.availablePercentage}
        isLoading={isLoading}
      />

      {/* Properties & Appointments Section */}
      <div className="grid gap-4 md:grid-cols-7 grid-cols-1 bg-slate-100 dark:bg-slate-900 rounded-xl p-4">
        {/* Recent Properties */}
        <div className="col-span-7 md:col-span-4 h-full">
          <div className="flex flex-col h-full">
            <RecentProperties
              properties={stats.recentProperties}
              isLoading={isLoading}
              onDelete={handleDeleteProperty}
            />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-span-7 md:col-span-3 ">
          <UpcomingAppointments
            appointments={stats.upcomingAppointments}
            isLoading={isLoading}
          />
        </div>

        {/* Recent Activity */}
        <div className="col-span-7 md:col-span-7 lg:col-span-4">
          <RecentActivity
            activities={stats.recentActivity}
            isLoading={isLoading}
          />
        </div>

        {/* Analytics Overview - New section */}
        <div className="col-span-7 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="w-1/3">
                          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-1/5">
                          <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <AnalyticsItem
                    label="Property Views"
                    value={127}
                    change={12}
                    isPositive={true}
                  />
                  <AnalyticsItem
                    label="Inquiries"
                    value={5}
                    change={3}
                    isPositive={true}
                  />
                  <AnalyticsItem
                    label="Listing Clicks"
                    value={68}
                    change={-5}
                    isPositive={false}
                  />
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href="/agent/analytics">
                        View Detailed Analytics
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface AnalyticsItemProps {
  label: string;
  value: number;
  change: number;
  isPositive: boolean;
}

function AnalyticsItem({
  label,
  value,
  change,
  isPositive,
}: AnalyticsItemProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`text-sm font-medium flex items-center ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${isPositive ? "bg-green-600" : "bg-red-600"}`}
          style={{ width: `${Math.min(100, (value / 150) * 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground">Total: {value}</p>
    </div>
  );
}
