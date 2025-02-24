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
import Loading from "./loading";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Suspense fallback={<Loading />}>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <DynamicBreadcrumb />
              {children}
            </div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
