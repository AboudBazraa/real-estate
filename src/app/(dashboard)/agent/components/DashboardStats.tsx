"use client";

import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Building2,
  Check,
  Calendar,
  MessageSquareText,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/shared/components/ui/skeleton";

export interface DashboardStatsProps {
  totalProperties: number;
  availableProperties: number;
  scheduledViewings: number;
  newInquiries: number;
  availablePercentage: number;
  isLoading: boolean;
}

export function DashboardStats({
  totalProperties,
  availableProperties,
  scheduledViewings,
  newInquiries,
  availablePercentage,
  isLoading,
}: DashboardStatsProps) {
  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {/* Total Properties */}
      <StatCard
        title="Total Properties"
        value={totalProperties}
        icon={<Building2 className="h-6 w-6 text-blue-600" />}
        bgColor="from-blue-50 to-blue-100 border-blue-200"
        iconColor="bg-blue-500/10"
        link="/agent/agentProperties"
        linkText="View all properties"
      />

      {/* Available Properties */}
      <StatCard
        title="Verified Properties"
        value={availableProperties}
        icon={<Check className="h-6 w-6 text-green-600" />}
        bgColor="from-green-50 to-green-100 border-green-200"
        iconColor="bg-green-500/10"
        trend={availablePercentage}
      />

      {/* Scheduled Viewings */}
      <StatCard
        title="Scheduled Viewings"
        value={scheduledViewings}
        icon={<Calendar className="h-6 w-6 text-amber-600" />}
        bgColor="from-amber-50 to-amber-100 border-amber-200"
        iconColor="bg-amber-500/10"
        link="/agent/meetings"
        linkText="View schedule"
      />

      {/* New Inquiries */}
      <StatCard
        title="New Inquiries"
        value={newInquiries}
        icon={<MessageSquareText className="h-6 w-6 text-purple-600" />}
        bgColor="from-purple-50 to-purple-100 border-purple-200"
        iconColor="bg-purple-500/10"
        link="/agent/request"
        linkText="View inquiries"
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  link?: string;
  linkText?: string;
  trend?: number;
}

const StatCard = ({
  title,
  value,
  icon,
  bgColor,
  iconColor,
  link,
  linkText,
  trend,
}: StatCardProps) => {
  return (
    <Card
      className={`bg-gradient-to-br ${bgColor} hover:shadow-md transition-shadow p-1`}
    >
      <CardContent className="p-4 md:p-6 ">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-blue-600">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 ${iconColor} rounded-full`}>{icon}</div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {link ? (
            <Link
              href={link}
              className="text-blue-600 font-medium hover:underline flex items-center"
            >
              {linkText}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ) : trend !== undefined ? (
            <div
              className={trend >= 0 ? "text-green-600" : "text-red-600"}
              title="Compared to last month"
            >
              <span className="font-medium flex items-center">
                {trend >= 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(trend)}%
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
