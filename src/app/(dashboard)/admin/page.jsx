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

  // PDF print handler with comprehensive details
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
    doc.text("Real Estate Dashboard Report", 40, yPos);
    yPos += 25;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, yPos);
    yPos += 30;

    // Executive summary
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Executive Summary", 40, yPos);
    yPos += 20;

    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const summary = `This report provides a comprehensive overview of the real estate portfolio performance. 
    The total property value is $${metrics.totalValue.toLocaleString()} across ${
      metrics.totalProperties
    } properties. 
    There are currently ${
      metrics.pendingApprovals
    } properties pending approval.`;

    const splitSummary = doc.splitTextToSize(summary, pageWidth - 80);
    doc.text(splitSummary, 40, yPos);
    yPos += splitSummary.length * 15 + 20;

    // Key metrics table
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Key Performance Metrics", 40, yPos);
    yPos += 20;

    autoTable(doc, {
      head: [["Metric", "Value", "Change", "Analysis"]],
      body: metricsData.map((data) => [
        data.title,
        data.value,
        data.change,
        data.title.includes("Value")
          ? "Above quarterly target"
          : data.title.includes("Pending")
          ? "Requires attention"
          : "Performing as expected",
      ]),
      startY: yPos,
      theme: "grid",
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      styles: { fontSize: 11 },
      columnStyles: {
        0: { cellWidth: 150 },
        3: { cellWidth: 200 },
      },
    });
    yPos = doc.lastAutoTable.finalY + 30;

    // Property breakdown section
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Property Portfolio Analysis", 40, yPos);
    yPos += 20;

    if (properties && properties.length > 0) {
      // Property category distribution
      const categories = {};
      properties.forEach((property) => {
        const category = property.category || "Uncategorized";
        categories[category] = (categories[category] || 0) + 1;
      });

      const categoryData = Object.entries(categories).map(
        ([category, count]) => [
          category,
          count,
          `${((count / properties.length) * 100).toFixed(1)}%`,
          `$${properties
            .filter((p) => (p.category || "Uncategorized") === category)
            .reduce((sum, p) => sum + (p.price || 0), 0)
            .toLocaleString()}`,
        ]
      );

      autoTable(doc, {
        head: [["Property Category", "Count", "Percentage", "Total Value"]],
        body: categoryData,
        startY: yPos,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246], textColor: 255 },
        styles: { fontSize: 11 },
      });
      yPos = doc.lastAutoTable.finalY + 20;

      // Location distribution
      const locations = {};
      properties.forEach((property) => {
        const location = property.location?.city || "Unknown";
        locations[location] = (locations[location] || 0) + 1;
      });

      // Top 5 locations
      const topLocations = Object.entries(locations)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([location, count]) => [
          location,
          count,
          `${((count / properties.length) * 100).toFixed(1)}%`,
        ]);

      doc.addPage();
      yPos = 50;

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Regional Distribution", 40, yPos);
      yPos += 20;

      autoTable(doc, {
        head: [["Top Locations", "Number of Properties", "Percentage"]],
        body: topLocations,
        startY: yPos,
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 11 },
      });
      yPos = doc.lastAutoTable.finalY + 25;

      // Featured vs Non-Featured Properties
      const featuredCount = properties.filter(
        (p) => p.featured === true
      ).length;
      const nonFeaturedCount = properties.filter(
        (p) => p.featured === false
      ).length;

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Featured Properties Analysis", 40, yPos);
      yPos += 20;

      autoTable(doc, {
        head: [["Status", "Count", "Percentage", "Action Required"]],
        body: [
          [
            "Featured",
            featuredCount,
            `${((featuredCount / properties.length) * 100).toFixed(1)}%`,
            "None",
          ],
          [
            "Pending Approval",
            nonFeaturedCount,
            `${((nonFeaturedCount / properties.length) * 100).toFixed(1)}%`,
            nonFeaturedCount > 10 ? "High Priority Review" : "Normal Review",
          ],
        ],
        startY: yPos,
        theme: "grid",
        headStyles: { fillColor: [99, 102, 241], textColor: 255 },
        styles: { fontSize: 11 },
      });
      yPos = doc.lastAutoTable.finalY + 25;
    }

    // User activity section
    doc.addPage();
    yPos = 50;

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("User Activity Metrics", 40, yPos);
    yPos += 20;

    autoTable(doc, {
      head: [["Metric", "Value", "Trend", "Recommendation"]],
      body: [
        [
          "Active Users",
          `${metrics.activeUsers} online`,
          "Increasing",
          "Maintain user engagement strategies",
        ],
        [
          "Total User Base",
          metrics.totalUsers.toString(),
          "Stable",
          "Consider growth campaigns",
        ],
        ["User Engagement Rate", "68%", "Up 5%", "Continue content strategy"],
        [
          "Average Session Duration",
          "12.5 min",
          "Up 2.1 min",
          "Positive trend - monitor",
        ],
      ],
      startY: yPos,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], textColor: 255 },
      styles: { fontSize: 11 },
    });

    // Add recommendations section
    yPos = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Recommendations", 40, yPos);
    yPos += 20;

    const recommendations = [
      "Review and process pending property approvals to improve inventory.",
      "Focus marketing efforts on high-value property categories.",
      "Consider expanding into emerging locations based on the regional analysis.",
      "Maintain current user engagement strategies as metrics show positive trends.",
      "Schedule periodic reviews of property pricing to ensure market competitiveness.",
    ];

    let bulletY = yPos;
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}.`, 40, bulletY);
      const splitRec = doc.splitTextToSize(rec, pageWidth - 100);
      doc.text(splitRec, 55, bulletY);
      bulletY += splitRec.length * 15 + 10;
    });

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
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
        "Real Estate Dashboard - Confidential",
        40,
        doc.internal.pageSize.getHeight() - 30
      );
    }

    doc.save("real-estate-dashboard-report.pdf");
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
            Generate Detailed Report
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
