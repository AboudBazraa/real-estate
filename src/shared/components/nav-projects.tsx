"use client";
import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";

// Translations for projects menu
const translations = {
  en: {
    projects: "Projects",
    more: "More",
    viewProject: "View Project",
    shareProject: "Share Project",
    deleteProject: "Delete Project",
  },
  ar: {
    projects: "المشاريع",
    more: "المزيد",
    viewProject: "عرض المشروع",
    shareProject: "مشاركة المشروع",
    deleteProject: "حذف المشروع",
  },
};

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    rtl?: boolean;
    menuItemClass?: string;
    textAlign?: string;
    iconPosition?: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const { isRTL, currentLanguage } = useTranslation();

  // Get translations based on current language
  const t =
    translations[currentLanguage as keyof typeof translations] ||
    translations.en;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className={isRTL ? "text-right w-full" : ""}>
        {t.projects}
      </SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a
                href={item.url}
                className={isRTL ? "flex-row-reverse justify-between" : ""}
              >
                <item.icon />
                <span
                  className={item.textAlign ? `text-${item.textAlign}` : ""}
                >
                  {item.name}
                </span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className={isRTL ? "right-auto left-1" : ""}
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : isRTL ? "left" : "right"}
                align={isMobile ? "end" : isRTL ? "end" : "start"}
              >
                <DropdownMenuItem
                  className={isRTL ? "flex-row-reverse text-right" : ""}
                >
                  <Folder
                    className={`${
                      isRTL ? "ml-2" : "mr-2"
                    } text-slate-500 dark:text-slate-400`}
                  />
                  <span>{t.viewProject}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={isRTL ? "flex-row-reverse text-right" : ""}
                >
                  <Share
                    className={`${
                      isRTL ? "ml-2" : "mr-2"
                    } text-slate-500 dark:text-slate-400`}
                  />
                  <span>{t.shareProject}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={isRTL ? "flex-row-reverse text-right" : ""}
                >
                  <Trash2
                    className={`${
                      isRTL ? "ml-2" : "mr-2"
                    } text-slate-500 dark:text-slate-400`}
                  />
                  <span>{t.deleteProject}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton
            className={isRTL ? "flex-row-reverse justify-between" : ""}
          >
            <MoreHorizontal />
            <span>{t.more}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
