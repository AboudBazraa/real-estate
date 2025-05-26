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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
import { useTranslation } from "@/shared/hooks/useTranslation";

// Translations
import agentDashboardTranslations from "./translations/agentDashboard";

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
  const { currentLanguage, isRTL } = useTranslation();

  // Get translations based on current language
  const t =
    agentDashboardTranslations[
      currentLanguage as keyof typeof agentDashboardTranslations
    ] || agentDashboardTranslations.en;

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
            <CardTitle className="text-center">{t.accessDenied}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-center mb-4 ${isRTL ? "rtl text-right" : ""}`}>
              {t.loginRequired}
            </p>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              {t.logIn}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // PDF print handler for agent dashboard
  const handlePrintPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 50;

    // Title and header
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text("Agent Dashboard Report", 40, yPos);
    yPos += 25;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, yPos);
    yPos += 30;

    if (user && user.email) {
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text(`Agent: ${user.email}`, 40, yPos);
      yPos += 30;
    }

    // Executive summary
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Portfolio Overview", 40, yPos);
    yPos += 20;

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const summary = `This report summarizes your real estate portfolio and activity metrics. 
    You currently manage ${stats.totalProperties} properties, with ${stats.availableProperties} available for sale or rent.
    You have ${stats.scheduledViewings} upcoming property viewings and ${stats.newInquiries} new inquiries.`;

    const splitSummary = doc.splitTextToSize(summary, pageWidth - 80);
    doc.text(splitSummary, 40, yPos);
    yPos += splitSummary.length * 15 + 20;

    // Key metrics table
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Key Performance Metrics", 40, yPos);
    yPos += 20;

    autoTable(doc, {
      head: [["Metric", "Value", "Performance"]],
      body: [
        ["Total Properties", stats.totalProperties.toString(), ""],
        [
          "Available Properties",
          stats.availableProperties.toString(),
          `${stats.availablePercentage}% growth`,
        ],
        ["Scheduled Viewings", stats.scheduledViewings.toString(), ""],
        ["New Inquiries", stats.newInquiries.toString(), ""],
      ],
      startY: yPos,
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      styles: { fontSize: 11 },
    });
    // @ts-ignore: lastAutoTable property comes from jspdf-autotable plugin
    yPos = (doc.lastAutoTable?.finalY || yPos) + 30;

    // Recent properties
    if (stats.recentProperties && stats.recentProperties.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Recent Property Listings", 40, yPos);
      yPos += 20;

      const propertyData = stats.recentProperties.map((property) => [
        property.title || "Untitled Property",
        property.type || "-",
        property.location?.city || "-",
        formatCurrency(property.price || 0),
        property.featured ? "Featured" : "Pending",
      ]);

      autoTable(doc, {
        head: [["Property Name", "Type", "Location", "Price", "Status"]],
        body: propertyData,
        startY: yPos,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 11 },
      });
      // @ts-ignore: lastAutoTable property comes from jspdf-autotable plugin
      yPos = (doc.lastAutoTable?.finalY || yPos) + 30;
    }

    // Add new page for appointments
    if (stats.upcomingAppointments && stats.upcomingAppointments.length > 0) {
      doc.addPage();
      yPos = 50;

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Upcoming Appointments", 40, yPos);
      yPos += 20;

      const appointmentData = stats.upcomingAppointments.map((apt) => [
        apt.client?.name || "Client",
        apt.property?.title || "Property",
        formatDate(apt.date) || "-",
        apt.status || "Scheduled",
      ]);

      autoTable(doc, {
        head: [["Client", "Property", "Date", "Status"]],
        body: appointmentData,
        startY: yPos,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 11 },
      });
      // @ts-ignore: lastAutoTable property comes from jspdf-autotable plugin
      yPos = (doc.lastAutoTable?.finalY || yPos) + 20;
    }

    // Analytics overview
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Analytics Overview", 40, yPos);
    yPos += 20;

    autoTable(doc, {
      head: [["Metric", "Value", "Change", "Trend"]],
      body: [
        ["Property Views", "127", "+12%", "Positive"],
        ["Inquiries", "5", "+3%", "Positive"],
        ["Listing Clicks", "68", "-5%", "Needs attention"],
      ],
      startY: yPos,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      styles: { fontSize: 11 },
    });

    // Footer with page numbers
    // Get the number of pages (handle TypeScript error with type assertion)
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 100,
        doc.internal.pageSize.getHeight() - 30
      );
      doc.text(
        "Agent Dashboard Report - Confidential",
        40,
        doc.internal.pageSize.getHeight() - 30
      );
    }

    doc.save("agent-dashboard-report.pdf");
  };

  return (
    <div className={`h-full flex-1 space-y-8 p-4 ${isRTL ? "rtl" : ""}`}>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.dashboard}</h2>
          <p className="text-muted-foreground">
            {t.managePropertiesAndAppointments}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrintPDF}
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9V2h12v7"></path>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <path d="M6 14h12v8H6z"></path>
            </svg>
            {t.generateReport || "Generate Report"}
          </Button>
          <Button asChild>
            <Link href="/agent/addNewProp">
              <Plus className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />{" "}
              {t.addProperty}
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
        translations={{
          totalProperties: t.totalProperties,
          verifiedProperties: t.verifiedProperties,
          scheduledViewings: t.scheduledViewings,
          newInquiries: t.newInquiries,
          viewAllProperties: t.viewAllProperties,
          viewSchedule: t.viewSchedule,
          viewInquiries: t.viewInquiries,
        }}
        isRTL={isRTL}
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
              translations={{
                recentProperties: t.recentProperties,
                viewAll: t.viewAll,
                noPropertiesYet: t.noPropertiesYet,
                addYourFirstProperty: t.addYourFirstProperty,
                addProperty: t.addProperty,
              }}
              isRTL={isRTL}
            />
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-span-7 md:col-span-3 ">
          <UpcomingAppointments
            appointments={stats.upcomingAppointments}
            isLoading={isLoading}
            translations={{
              upcomingAppointments: t.upcomingAppointments,
              viewAll: t.viewAll,
              with: t.with,
              viewDetails: t.viewDetails,
              noUpcomingAppointments: t.noUpcomingAppointments,
              scheduledAppointmentsWillAppear:
                t.scheduledAppointmentsWillAppear,
            }}
            isRTL={isRTL}
          />
        </div>

        {/* Recent Activity */}
        <div className="col-span-7 md:col-span-7 lg:col-span-4">
          <RecentActivity
            activities={stats.recentActivity}
            isLoading={isLoading}
            translations={{
              recentActivity: t.recentActivity,
              noRecentActivity: t.noRecentActivity,
              recentActivityWillAppear: t.recentActivityWillAppear,
            }}
            isRTL={isRTL}
          />
        </div>

        {/* Analytics Overview - New section */}
        <div className="col-span-7 lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t.analyticsOverview}</CardTitle>
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
                    label={t.propertyViews}
                    value={127}
                    change={12}
                    isPositive={true}
                    isRTL={isRTL}
                    total={t.total}
                  />
                  <AnalyticsItem
                    label={t.inquiries}
                    value={5}
                    change={3}
                    isPositive={true}
                    isRTL={isRTL}
                    total={t.total}
                  />
                  <AnalyticsItem
                    label={t.listingClicks}
                    value={68}
                    change={-5}
                    isPositive={false}
                    isRTL={isRTL}
                    total={t.total}
                  />
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link href="/agent/analytics">
                        {t.viewDetailedAnalytics}
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
  isRTL?: boolean;
  total: string;
}

function AnalyticsItem({
  label,
  value,
  change,
  isPositive,
  isRTL = false,
  total,
}: AnalyticsItemProps) {
  return (
    <div className="space-y-1.5">
      <div
        className={`flex justify-between items-center ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`text-sm font-medium flex items-center ${
            isPositive ? "text-green-600" : "text-red-600"
          } ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${isPositive ? "bg-green-600" : "bg-red-600"}`}
          style={{
            width: `${Math.min(100, (value / 150) * 100)}%`,
            float: isRTL ? "right" : "left",
          }}
        ></div>
      </div>
      <p
        className={`text-xs text-muted-foreground ${isRTL ? "text-right" : ""}`}
      >
        {total}: {value}
      </p>
    </div>
  );
}
