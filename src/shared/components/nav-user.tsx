"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
  Globe,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useEffect } from "react";

// Translations for user profile dropdown
const translations = {
  en: {
    upgradeToPro: "Upgrade to Pro",
    account: "Account",
    billing: "Billing",
    notifications: "Notifications",
    switchLanguage: "Switch to Arabic",
    logout: "Log out",
  },
  ar: {
    upgradeToPro: "الترقية إلى النسخة الاحترافية",
    account: "الحساب",
    billing: "الفواتير",
    notifications: "الإشعارات",
    switchLanguage: "تبديل إلى الإنجليزية",
    logout: "تسجيل الخروج",
  },
};

export function NavUser() {
  const { user, logout } = useAuth();
  const { isMobile } = useSidebar();
  const { changeLanguage, currentLanguage, isRTL } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "ar" : "en";
    changeLanguage(newLanguage);
  };

  // Apply RTL class to the document body when language changes
  useEffect(() => {
    // Set the direction based on the current language
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    // TypeScript fix - ensure currentLanguage is a string
    if (typeof currentLanguage === "string") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, isRTL]);

  if (!user) {
    return null;
  }

  // Get user details from metadata
  const username =
    user.user_metadata?.username || user.email?.split("@")[0] || "User";
  const userRole = user.user_metadata?.role || "user";
  // Capitalize the first letter of the role for display
  const role = userRole.charAt(0).toUpperCase() + userRole.slice(1);
  const avatar = user.user_metadata?.avatar || "/default-avatar.png";
  const userInitial = username ? username[0].toUpperCase() : "?";
  const email = user.user_metadata?.email;

  // Get translations based on current language
  const t =
    translations[currentLanguage as keyof typeof translations] ||
    translations.en;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatar} alt={username} />
                <AvatarFallback className="rounded-lg">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div
                className={`grid flex-1 text-${
                  isRTL ? "right" : "left"
                } text-sm leading-tight`}
              >
                <span className="truncate font-semibold">
                  {username} /
                  <span className="truncate text-xs text-gray-500">{role}</span>
                </span>
                <span className="truncate text-xs text-gray-500">{email}</span>
              </div>
              <ChevronsUpDown
                className={`${isRTL ? "mr-auto" : "ml-auto"} size-4`}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : isRTL ? "left" : "right"}
            align={isRTL ? "start" : "end"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div
                className={`flex items-center gap-2 px-1 py-1.5 text-${
                  isRTL ? "right" : "left"
                } text-sm ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatar} alt={username} />
                  <AvatarFallback className="rounded-lg">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`grid flex-1 text-${
                    isRTL ? "right" : "left"
                  } text-sm leading-tight`}
                >
                  <span className="truncate font-semibold">{username}</span>
                  <span className="truncate text-xs">{role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={isRTL ? "flex-row-reverse text-right" : ""}
              >
                <Sparkles className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {t.upgradeToPro}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className={isRTL ? "flex-row-reverse text-right" : ""}
              >
                <BadgeCheck
                  className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"}
                />
                {t.account}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={isRTL ? "flex-row-reverse text-right" : ""}
              >
                <CreditCard
                  className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"}
                />
                {t.billing}
              </DropdownMenuItem>
              <DropdownMenuItem
                className={isRTL ? "flex-row-reverse text-right" : ""}
              >
                <Bell className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {t.notifications}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={toggleLanguage}
                className={isRTL ? "flex-row-reverse text-right" : ""}
              >
                <Globe className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {t.switchLanguage}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className={isRTL ? "flex-row-reverse text-right" : ""}
            >
              <LogOut className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {t.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
