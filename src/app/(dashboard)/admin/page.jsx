"use client";

import { useEffect, useState } from "react";
import DynamicBreadcrumb from "@/app/(dashboard)/components/breadcrumb";
import CardDashboard from "@/app/(dashboard)/components/card";
import { ChartOne, ChartTwo } from "@/app/(dashboard)/admin/components/chart";
import { TableDemo } from "@/app/(dashboard)/admin/components/table";
import { useProperties } from "@/shared/hooks/useProperties";
import { Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function AdminPage() {
  const { fetchProperties, properties, totalCount, loading } = useProperties();
  const [metrics, setMetrics] = useState({
    totalProperties: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    activeUsers: 0,
    totalValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Move these values to state to fix dependency array issues
  const [usersData, setUsersData] = useState({
    usersOnline: 573,
    usersOnlineChange: 201,
  });

  // Fetch properties on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all properties
        await fetchProperties(0, 1000); // Large number to get all properties

        // Simulate fetch for other metrics that would come from different hooks
        // In a real app, you would have separate hooks for users, etc.
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: error.message || "Please try again later",
        });
      }
    };

    loadData();
  }, [fetchProperties, toast]);

  // Calculate metrics based on properties
  useEffect(() => {
    if (properties) {
      // Calculate actual metrics based on property data
      const pendingCount = properties.filter(
        (p) => p.featured === false
      ).length;

      // Calculate total value of all properties
      const totalValue = properties.reduce((sum, property) => {
        return sum + (property.price || 0);
      }, 0);

      // Update metrics
      setMetrics({
        totalProperties: properties.length,
        totalUsers: 2350, // Mocked user count
        pendingApprovals: pendingCount,
        activeUsers: usersData.usersOnline, // Now using from state
        totalValue,
      });
    }
  }, [properties, usersData]); // Stable dependency array

  // Function to refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProperties(0, 1000);

      // Simulate refreshing user data too
      setUsersData((prev) => ({
        usersOnline: prev.usersOnline + Math.floor(Math.random() * 10),
        usersOnlineChange: Math.floor(Math.random() * 50) + 180,
      }));

      toast({
        title: "Data refreshed",
        description: "Dashboard data has been updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // PDF print handler (text-based, not screenshot)
  const handlePrintPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });
    doc.setFontSize(22);
    doc.text("Dashboard Report", 40, 50);
    doc.setFontSize(14);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 70);

    // Table of metrics
    autoTable(doc, {
      head: [["Metric", "Value", "Change"]],
      body: metricsData.map((data) => [data.title, data.value, data.change]),
      startY: 90,
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 12 },
    });

    // Add more sections as needed (e.g., analytics, charts as images, etc.)

    doc.save("dashboard-report.pdf");
  };

  const metricsData = [
    {
      title: "Total Properties",
      value: isLoading ? "Loading..." : metrics.totalProperties.toString(),
      change: "+20.1% from last month",
      icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    },
    {
      title: "Total Value",
      value: isLoading
        ? "Loading..."
        : `$${metrics.totalValue.toLocaleString()}`,
      change: "+15.7% from last month",
      icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    },
    {
      title: "Pending Approvals",
      value: isLoading ? "Loading..." : metrics.pendingApprovals.toString(),
      change: "+19% from last month",
      icon: "M2 5h20v14H2zM2 10h20",
    },
    {
      title: "Active Users",
      value: isLoading ? "Loading..." : `${metrics.activeUsers} online`,
      change: `+${usersData.usersOnlineChange} since last hour`,
      icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    },
  ];

  return (
    <div className="p-4 pb-8 w-full mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrintPDF}
            className="flex items-center gap-2"
          >
            Print PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>
      <div id="dashboard-report-section">
        {isLoading ? (
          <div className="flex justify-center items-center h-60 bg-muted/20 rounded-xl">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={container}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {metricsData.map((data) => (
                <motion.div key={data.title} variants={item} className="w-full">
                  <CardDashboard
                    title={data.title}
                    icon={data.icon}
                    value={data.value}
                    change={data.change}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={item} className="mt-8 mb-6">
              <h3 className="text-xl font-semibold mb-4">Property Analytics</h3>
              <TableDemo />
            </motion.div>

            <motion.div variants={item} className=" mt-8">
              <div className="bg-card rounded-xl p-6 shadow-sm border dark:border-gray-700 border-gray-300">
                <h3 className="text-lg font-semibold mb-4">
                  Property Categories
                </h3>
                <ChartTwo />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
