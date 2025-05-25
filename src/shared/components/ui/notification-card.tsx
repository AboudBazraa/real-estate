import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Mail, Phone, Bell, MessageSquare, Calendar, User } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface NotificationCardProps {
  id: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  related_id?: string;
  user?: {
    username?: string;
    email?: string;
    phone_number?: string;
    avatar_url?: string;
  };
  onMarkAsRead?: (id: string) => void;
}

export function NotificationCard({
  id,
  type,
  message,
  created_at,
  is_read,
  related_id,
  user,
  onMarkAsRead,
}: NotificationCardProps) {
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "property_inquiry":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "message_received":
        return <Mail className="h-5 w-5 text-green-500" />;
      case "appointment_request":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format the time
  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "p-4 border-b last:border-b-0 transition-colors",
        is_read ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p
              className={cn("text-sm font-medium", !is_read && "font-semibold")}
            >
              {message}
            </p>
            {!is_read && onMarkAsRead && (
              <button
                onClick={() => onMarkAsRead(id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>

          {/* Contact Information Section */}
          {user &&
            (type === "property_inquiry" ||
              type === "message_received" ||
              type === "appointment_request") && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>
                      {user.username ? user.username[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">
                    {user.username || "User"}
                  </span>
                </div>

                {user.email && (
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                )}

                {user.phone_number && (
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                    <Phone className="h-3 w-3 mr-1" />
                    <a
                      href={`tel:${user.phone_number}`}
                      className="hover:underline"
                    >
                      {user.phone_number}
                    </a>
                  </div>
                )}
              </div>
            )}

          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
            {timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NotificationList({
  notifications,
  onMarkAsRead,
}: {
  notifications: NotificationCardProps[];
  onMarkAsRead?: (id: string) => void;
}) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          {...notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}
