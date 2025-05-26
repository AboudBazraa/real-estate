"use client";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/shared/components/nav-main";
import { NavProjects } from "@/shared/components/nav-projects";
import { NavSecondary } from "@/shared/components/nav-secondary";
import { NavUser } from "@/shared/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import getSidebarData from "@/app/(dashboard)/constants/sideLinkData";
import Link from "next/link";
import { useRole } from "@/app/auth/hooks/useRole";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useRole();
  const { isRTL, currentLanguage } = useTranslation();

  // Get the sidebar data with the appropriate translations
  const data = getSidebarData(currentLanguage);

  return (
    <Sidebar
      variant="inset"
      className={isRTL ? "rtl rtl-reverse-flex border-l border-r-0" : ""}
      side={isRTL ? "right" : "left"}
      {...props}
    >
      <SidebarHeader className={isRTL ? "text-right" : ""}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/"
                className={isRTL ? "flex-row-reverse justify-between" : ""}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div
                  className={`grid flex-1 text-${
                    isRTL ? "right" : "left"
                  } text-sm leading-tight`}
                >
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={isRTL ? "rtl-content" : ""}>
        <NavMain items={data[role]?.navMain || []} />
        <NavProjects projects={data[role]?.projects || []} />
        <NavSecondary items={data[role]?.navSecondary || []} />
      </SidebarContent>
      <SidebarFooter className={isRTL ? "rtl-footer" : ""}>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
