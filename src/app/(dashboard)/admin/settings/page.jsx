"use client";

import { useState, useEffect, Suspense } from "react";
import {
  CreditCard,
  Globe,
  LayoutDashboard,
  Palette,
  Settings,
  Shield,
  Users,
  Loader2,
  RefreshCw,
  Check,
  ChevronRight,
  Bell,
  Moon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { SectionCard } from "@/app/(dashboard)/admin/settings/components/section-card";
import { SiteSettingsForm } from "@/app/(dashboard)/admin/settings/components/site-settings-form";
import { SettingItem } from "@/app/(dashboard)/admin/settings/components/setting-item";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
};

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
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [settings, setSettings] = useState({
    siteInfo: {
      name: "Real Estate Pro",
      url: "https://realestatepro.com",
      description:
        "A professional real estate platform for agents and brokers.",
    },
    localization: {
      automaticLanguage: true,
      rtlSupport: false,
    },
    userManagement: {
      enableRegistration: true,
      requireEmailVerification: true,
    },
    security: {
      twoFactorAuth: true,
      strongPasswords: true,
    },
    customization: {
      darkMode: true,
      customLogo: false,
    },
    integrations: {
      stripe: true,
      paypal: false,
    },
    billing: {
      billingAddress: false,
      paymentMethod: false,
    },
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setIsDirty(false);

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Settings Refreshed",
        description: "Your settings have been refreshed.",
        variant: "success",
      });
    }, 1000);
  };

  const handleSaveSettings = () => {
    // Simulate saving settings with loading state
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      setIsDirty(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
        variant: "success",
      });
    }, 1000);
  };

  const handleSettingChange = (section, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value,
      },
    }));
    setIsDirty(true);
  };

  const SettingLoader = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>
    </div>
  );

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your website settings and preferences
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isRefreshing || isLoading || !isDirty}
            className="gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </motion.div>

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className=""
      >
        <motion.div variants={item}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
            {navigationItems.map((item) => (
              <TabsTrigger
                key={item.href.replace("#", "")}
                value={item.href.replace("#", "")}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {item.label.split(" ")[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* General Settings */}
          <TabsContent
            key="general-tab"
            value="general"
            className="space-y-4 mt-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="general-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-10 w-28" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div className="mt-4" variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="general-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="Site Information"
                      description="Configure your website details and branding"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <SiteSettingsForm
                        initialData={settings.siteInfo}
                        onSubmit={(values) => {
                          handleSettingChange("siteInfo", "name", values.name);
                          handleSettingChange("siteInfo", "url", values.url);
                          handleSettingChange(
                            "siteInfo",
                            "description",
                            values.description
                          );
                        }}
                      />
                    </SectionCard>
                  </motion.div>

                  <motion.div className="mt-4" variants={item}>
                    <SectionCard
                      title="Localization"
                      description="Configure language and regional settings"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Automatic Language Detection"
                          description="Automatically detect and switch to user's preferred language"
                          checked={settings.localization.automaticLanguage}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "localization",
                              "automaticLanguage",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="Right-to-Left Support"
                          description="Enable support for RTL languages"
                          checked={settings.localization.rtlSupport}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "localization",
                              "rtlSupport",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* User Management Settings */}
          <TabsContent key="users-tab" value="users" className="space-y-4 mt-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="users-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="users-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="User Management"
                      description="Manage user accounts and permissions"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Enable User Registration"
                          description="Allow users to register on the site"
                          checked={settings.userManagement.enableRegistration}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "userManagement",
                              "enableRegistration",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="Require Email Verification"
                          description="Require users to verify their email addresses"
                          checked={
                            settings.userManagement.requireEmailVerification
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "userManagement",
                              "requireEmailVerification",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent
            key="security-tab"
            value="security"
            className="space-y-4 mt-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="security-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="security-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="Authentication"
                      description="Configure security and authentication settings"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Two-Factor Authentication"
                          description="Require 2FA for admin accounts"
                          checked={settings.security.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "security",
                              "twoFactorAuth",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="Strong Passwords"
                          description="Enforce strong password policy"
                          checked={settings.security.strongPasswords}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "security",
                              "strongPasswords",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Customization Settings */}
          <TabsContent
            key="customization-tab"
            value="customization"
            className="space-y-4 mt-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="customization-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="customization-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="Site Customization"
                      description="Customize the look and feel of your site"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Enable Dark Mode"
                          description="Allow users to switch to dark mode"
                          checked={settings.customization.darkMode}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "customization",
                              "darkMode",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="Custom Logo"
                          description="Upload a custom logo for your site"
                          checked={settings.customization.customLogo}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "customization",
                              "customLogo",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Integration Settings */}
          <TabsContent
            key="integrations-tab"
            value="integrations"
            className="space-y-4 mt-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="integrations-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="integrations-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="Payment Gateways"
                      description="Configure payment processing integrations"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Stripe Integration"
                          description="Process payments via Stripe"
                          checked={settings.integrations.stripe}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "integrations",
                              "stripe",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="PayPal Integration"
                          description="Accept PayPal payments"
                          checked={settings.integrations.paypal}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "integrations",
                              "paypal",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent
            key="billing-tab"
            value="billing"
            className="space-y-4 mt-6"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="billing-loading"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <SettingLoader />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="billing-content"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                >
                  <motion.div variants={item}>
                    <SectionCard
                      title="Billing Information"
                      description="Manage billing and subscription settings"
                      className="transition-all duration-200 hover:shadow-md"
                    >
                      <div className="space-y-4">
                        <SettingItem
                          title="Billing Address"
                          description="Update your billing address"
                          checked={settings.billing.billingAddress}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "billing",
                              "billingAddress",
                              checked
                            )
                          }
                        />
                        <SettingItem
                          title="Payment Method"
                          description="Manage your payment methods"
                          checked={settings.billing.paymentMethod}
                          onCheckedChange={(checked) =>
                            handleSettingChange(
                              "billing",
                              "paymentMethod",
                              checked
                            )
                          }
                        />
                      </div>
                    </SectionCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      {/* Refreshing indicator */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            className="fixed bottom-6 right-6 bg-background/90 backdrop-blur-sm text-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Updating settings...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save reminder if there are unsaved changes */}
      <AnimatePresence>
        {isDirty && !isRefreshing && (
          <motion.div
            className="fixed bottom-6 left-6 bg-background/90 backdrop-blur-sm text-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border border-amber-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Bell className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium">
              You have unsaved changes
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
