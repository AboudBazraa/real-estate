"use client";

import { ChevronRight, ChevronLeft, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    rtl?: boolean;
    menuItemClass?: string;
    textAlign?: string;
    iconPosition?: string;
    submenuClass?: string;
    items?: {
      title: string;
      url: string;
      rtl?: boolean;
      menuItemClass?: string;
      textAlign?: string;
      iconPosition?: string;
      submenuClass?: string;
    }[];
  }[];
}) {
  const [activeUrl, setActiveUrl] = useState("");
  const { isRTL } = useTranslation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={isRTL ? "text-right w-full" : ""}>
        Platform
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                onClick={() => setActiveUrl(item.url)}
                className={`${
                  activeUrl === item.url && "bg-zinc-200 dark:bg-zinc-800"
                } ${isRTL ? "rtl-hover-indicator relative" : ""}`}
                tooltip={item.title}
              >
                <Link
                  href={item.url}
                  className={item.rtl ? "flex-row-reverse justify-between" : ""}
                >
                  <item.icon />
                  <span
                    className={item.textAlign ? `text-${item.textAlign}` : ""}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className={`data-[state=open]:rotate-90 ${
                        isRTL ? "right-auto left-1" : ""
                      }`}
                    >
                      {isRTL ? <ChevronLeft /> : <ChevronRight />}
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub
                      className={
                        isRTL
                          ? "border-r border-l-0 mr-3.5 ml-0 pr-2.5 pl-0"
                          : ""
                      }
                    >
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            onClick={() => setActiveUrl(subItem.url)}
                            className={`${
                              activeUrl === subItem.url &&
                              "bg-zinc-200 dark:bg-zinc-800"
                            }`}
                          >
                            <Link
                              href={subItem.url}
                              className={
                                subItem.rtl
                                  ? "flex-row-reverse justify-between w-full"
                                  : ""
                              }
                            >
                              <span
                                className={
                                  subItem.textAlign
                                    ? `text-${subItem.textAlign}`
                                    : ""
                                }
                              >
                                {subItem.title}
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
