"use client";

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
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { SectionCard } from "@/app/(dashboard)/admin/settings/components/section-card";
import { SiteSettingsForm } from "@/app/(dashboard)/admin/settings/components/site-settings-form";
import { SettingItem } from "@/app/(dashboard)/admin/settings/components/setting-item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

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

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
      variant: "success",
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="flex-1 ">
        <div className="container space-y-8 p-6 pb-16 ">
          {/* Header with Search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your website settings and preferences
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <Tabs defaultValue="general" className="space-y-4 w-full flex flex-col gap-10">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Suspense fallback={<div>Loading...</div>}>
                <SectionCard
                  title="Site Information"
                  description="Configure your website details and branding"
                >
                  <SiteSettingsForm onSave={handleSaveSettings} />
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
            </TabsContent>

            {/* User Management Settings */}
            <TabsContent value="users" className="space-y-4">
              <SectionCard
                title="User Management"
                description="Manage user accounts and permissions"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Enable User Registration"
                    description="Allow users to register on the site"
                    checked={true}
                  />
                  <SettingItem
                    title="Require Email Verification"
                    description="Require users to verify their email addresses"
                    checked={false}
                  />
                </div>
              </SectionCard>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
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
            </TabsContent>

            {/* Customization Settings */}
            <TabsContent value="customization" className="space-y-4">
              <SectionCard
                title="Site Customization"
                description="Customize the look and feel of your site"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Enable Dark Mode"
                    description="Allow users to switch to dark mode"
                    checked={false}
                  />
                  <SettingItem
                    title="Custom Logo"
                    description="Upload a custom logo for your site"
                    checked={false}
                  />
                </div>
              </SectionCard>
            </TabsContent>

            {/* Integration Settings */}
            <TabsContent value="integrations" className="space-y-4">
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
                    checked={false}
                  />
                </div>
              </SectionCard>
            </TabsContent>

            {/* Billing Settings */}
            <TabsContent value="billing" className="space-y-4">
              <SectionCard
                title="Billing Information"
                description="Manage billing and subscription settings"
              >
                <div className="space-y-4">
                  <SettingItem
                    title="Billing Address"
                    description="Update your billing address"
                    checked={false}
                  />
                  <SettingItem
                    title="Payment Method"
                    description="Manage your payment methods"
                    checked={false}
                  />
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}