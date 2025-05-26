import React from "react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { useTranslation } from "@/shared/hooks/useTranslation";
import userListTranslations from "./translations";

// renderUserCard ///////////////////////////////////
export const renderUserCard = (
  user,
  index,
  onEdit,
  onDelete,
  onStatusChange,
  onView
) => {
  const { currentLanguage, isRTL } = useTranslation();
  const t = userListTranslations[currentLanguage] || userListTranslations.en;

  // Get user details from metadata
  const username =
    user.user_metadata?.username || user.email?.split("@")[0] || "User";
  const userRole = user.user_metadata?.role || "user";
  const userInitial = username ? username[0].toUpperCase() : "?";
  const avatar = user.user_metadata?.avatar || null;
  const status = user.status || "active";
  const lastActive = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString()
    : t.inactive;

  // Get translated role name
  const roleName =
    userRole === "admin" ? t.admin : userRole === "agent" ? t.agent : t.user;

  return (
    <Card key={user.id || index} className={isRTL ? "rtl" : ""}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{username}</CardTitle>
        <UserActionsDropdown
          user={user}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user.id)}
          onStatusChange={onStatusChange}
          onView={() => onView(user)}
        />
      </CardHeader>
      <CardContent>
        <div
          className={`flex items-center space-y-4 flex-col sm:flex-row sm:space-y-0 sm:space-x-4 ${
            isRTL ? "sm:flex-row-reverse sm:space-x-reverse" : ""
          }`}
        >
          <Avatar className="h-16 w-16">
            {avatar && <AvatarImage src={avatar} alt={username} />}
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className={`space-y-2 ${isRTL ? "text-right" : ""}`}>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{user.email}</p>
              <div
                className={`flex items-center ${
                  isRTL ? "flex-row-reverse justify-end" : ""
                }`}
              >
                <Badge variant="outline" className="capitalize">
                  {roleName}
                </Badge>
                <Badge
                  className={`ml-2 ${isRTL ? "mr-2 ml-0" : ""} ${
                    status === "blocked"
                      ? "bg-red-500"
                      : status === "active"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {status === "blocked"
                    ? t.blocked
                    : status === "active"
                    ? t.active
                    : t.inactive}
                </Badge>
              </div>
            </div>
            <p
              className={`text-xs text-muted-foreground ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t.lastActive}: {lastActive}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
