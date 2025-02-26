import { Suspense } from "react";
import {
  CreditCard,
  Globe,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  Users,
} from "lucide-react";

// import { MobileNav } from "@/components/layout/mobile-nav";
// import { SidebarNav } from "@/components/layout/sidebar-nav";
// import { SearchCommand } from "@/components/settings/search-command";
import { SectionCard } from "@/app/(dashboard)/admin/settings/components/section-card";
import { SiteSettingsForm } from "@/app/(dashboard)/admin/settings/components/site-settings-form";
import { SettingItem } from "@/app/(dashboard)/admin/settings/components/setting-item";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { getSiteSettings } from "@/lib/actions";
// import type { NavigationItem } from "@/types/settings";

const navigationItems = [
  {
    href: "#general",
    label: "General Settings",
    icon: Settings,
    current: true,
  },
  {
    href: "#users",
    label: "User Management",
    icon: Users,
    current: false,
  },
  {
    href: "#security",
    label: "Security",
    icon: Shield,
    current: false,
  },
  {
    href: "#customization",
    label: "Customization",
    icon: Palette,
    current: false,
  },
  {
    href: "#integrations",
    label: "Integrations",
    icon: Globe,
    current: false,
  },
  {
    href: "#billing",
    label: "Billing",
    icon: CreditCard,
    current: false,
  },
];

export default async function SettingsPage({ searchParams }) {
  // const siteSettings = await getSiteSettings();
  // const activeTab = searchParams.tab || "general";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      {/* <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
        <div className="border-b p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <LayoutDashboard className="h-5 w-5" />
            Admin Dashboard
          </h2>
        </div>
        <SidebarNav items={navigationItems} />
      </aside> */}

      {/* Main Content */}
      <main className="flex-1">
        <div className="container max-w-6xl space-y-8 p-6 pb-16">
          {/* Header with Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your website settings and preferences
              </p>
            </div>
            {/* <SearchCommand /> */}
          </div>

          {/* Settings Sections */}
          {/* <Tabs defaultValue={activeTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="property">Property</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList> */}

            {/* General Settings */}
            {/* <TabsContent value="general" className="space-y-4"> */}
              <Suspense fallback={<div>Loading...</div>}>
                <SectionCard
                  title="Site Information"
                  description="Configure your website details and branding"
                >
                  <SiteSettingsForm />
                </SectionCard>
              </Suspense>

              <SectionCard
                title="Localization"
                description="Configure language and regional settings"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Automatic Language Detection"
                    description="Automatically detect and switch to user's preferred language"
                    checked={true}
                  />
                  <SettingItem
                    title="Right-to-Left Support"
                    description="Enable support for RTL languages"
                    checked={false}
                  />
                </div>
              </SectionCard>
            {/* </TabsContent> */}

            {/* Property Settings */}
            {/* <TabsContent value="property" className="space-y-4">
              <SectionCard
                title="Property Configuration"
                description="Manage property listing settings and workflows"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Property Approval"
                    description="Require approval for new property listings"
                  />
                  <SettingItem
                    title="Featured Properties"
                    description="Allow featured property listings"
                    checked={true}
                  />
                </div>
              </SectionCard>
            </TabsContent> */}

            {/* Security Settings */}
            {/* <TabsContent value="security" className="space-y-4">
              <SectionCard
                title="Authentication"
                description="Configure security and authentication settings"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Two-Factor Authentication"
                    description="Require 2FA for admin accounts"
                    checked={true}
                  />
                  <SettingItem
                    title="Strong Passwords"
                    description="Enforce strong password policy"
                    checked={true}
                  />
                </div>
              </SectionCard>
            </TabsContent> */}

            {/* Integration Settings */}
            {/* <TabsContent value="integrations" className="space-y-4">
              <SectionCard
                title="Payment Gateways"
                description="Configure payment processing integrations"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Stripe Integration"
                    description="Process payments via Stripe"
                    checked={true}
                  />
                  <SettingItem
                    title="PayPal Integration"
                    description="Accept PayPal payments"
                  />
                </div>
              </SectionCard>
            </TabsContent> */}
          {/* </Tabs> */}
        </div>
      </main>
    </div>
  );
}