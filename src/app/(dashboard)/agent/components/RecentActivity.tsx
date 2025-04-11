"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Building2, Eye, MessageSquareText } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { timeAgo } from "@/shared/utils/property-utils";

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  property_id?: string;
  property_title?: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "new_inquiry":
        return <MessageSquareText className="h-4 w-4 text-primary" />;
      case "property_viewed":
        return <Eye className="h-4 w-4 text-primary" />;
      default:
        return <Building2 className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ActivitySkeleton />
        ) : activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.message}</p>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {timeAgo(activity.timestamp)}
                    </span>
                  </div>
                  {activity.property_title && (
                    <p className="text-sm text-muted-foreground">
                      {activity.property_id ? (
                        <Link
                          href={`/agent/properties/${activity.property_id}`}
                          className="hover:underline hover:text-primary transition-colors"
                        >
                          {activity.property_title}
                        </Link>
                      ) : (
                        activity.property_title
                      )}
                    </p>
                  )}
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
  );
}

const ActivitySkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
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
