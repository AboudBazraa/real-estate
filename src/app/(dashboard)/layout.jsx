"use client";

import { AppSidebar } from "@/shared/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import DynamicBreadcrumb from "@/app/(dashboard)/components/breadcrumb";
import { Suspense } from "react";
import { UserProvider } from "@/shared/providers/UserProvider";
import { SupabaseProvider } from "@/shared/providers/SupabaseProvider";
import { withAuth } from "@/shared/components/withAuth";
// import Loading from "./loading";

function DashboardLayout({ children }) {
  return (
    <SupabaseProvider>
      <UserProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <DynamicBreadcrumb />
              <Suspense fallback={<h1>Loading...</h1>}>{children}</Suspense>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </SupabaseProvider>
  );
}

// Apply the withAuth HOC to protect all dashboard routes
export default withAuth(DashboardLayout);
