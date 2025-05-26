import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    rtl?: boolean;
    menuItemClass?: string;
    textAlign?: string;
    iconPosition?: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isRTL } = useTranslation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a
                  href={item.url}
                  className={item.rtl ? "flex-row-reverse justify-between" : ""}
                >
                  <item.icon />
                  <span
                    className={item.textAlign ? `text-${item.textAlign}` : ""}
                  >
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
