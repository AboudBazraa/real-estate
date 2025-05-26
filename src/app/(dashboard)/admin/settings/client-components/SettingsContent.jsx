"use client";

import { useState, useEffect, useRef } from "react";
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

// Arabic translations for all UI strings
const AR = {
  Settings: "الإعدادات",
  "Manage your website settings and preferences": "إدارة إعدادات ومفضلات موقعك",
  Refresh: "تحديث",
  "Save Changes": "حفظ التغييرات",
  "General Settings": "الإعدادات العامة",
  "User Management": "إدارة المستخدمين",
  Security: "الأمان",
  Customization: "التخصيص",
  Integrations: "التكاملات",
  Billing: "الفوترة",
  "Site Information": "معلومات الموقع",
  "Configure your website details and branding":
    "تكوين تفاصيل الموقع والعلامة التجارية",
  Localization: "إعدادات اللغة",
  "Configure language and regional settings": "تكوين إعدادات اللغة والمنطقة",
  "Automatic Language Detection": "الكشف التلقائي عن اللغة",
  "Automatically detect and switch to user's preferred language":
    "الكشف تلقائيًا والتبديل إلى لغة المستخدم المفضلة",
  "Right-to-Left Support": "دعم الكتابة من اليمين إلى اليسار",
  "Enable support for RTL languages": "تمكين دعم اللغات من اليمين إلى اليسار",
  "User Management Section": "قسم إدارة المستخدمين",
  "Manage user accounts and permissions": "إدارة حسابات وصلاحيات المستخدمين",
  "Enable User Registration": "تمكين تسجيل المستخدمين",
  "Allow users to register on the site": "السماح للمستخدمين بالتسجيل في الموقع",
  "Require Email Verification": "طلب التحقق من البريد الإلكتروني",
  "Require users to verify their email addresses":
    "طلب من المستخدمين التحقق من بريدهم الإلكتروني",
  Authentication: "المصادقة",
  "Configure security and authentication settings":
    "تكوين إعدادات الأمان والمصادقة",
  "Two-Factor Authentication": "المصادقة الثنائية",
  "Require 2FA for admin accounts": "طلب المصادقة الثنائية لحسابات الإدارة",
  "Strong Passwords": "كلمات مرور قوية",
  "Enforce strong password policy": "فرض سياسة كلمات مرور قوية",
  "Site Customization": "تخصيص الموقع",
  "Customize the look and feel of your site": "تخصيص مظهر وإحساس موقعك",
  "Enable Dark Mode": "تمكين الوضع الداكن",
  "Allow users to switch to dark mode":
    "السماح للمستخدمين بالتبديل إلى الوضع الداكن",
  "Custom Logo": "شعار مخصص",
  "Upload a custom logo for your site": "رفع شعار مخصص لموقعك",
  "Payment Gateways": "بوابات الدفع",
  "Configure payment processing integrations": "تكوين تكاملات معالجة الدفع",
  "Stripe Integration": "تكامل Stripe",
  "Process payments via Stripe": "معالجة المدفوعات عبر Stripe",
  "PayPal Integration": "تكامل PayPal",
  "Accept PayPal payments": "قبول مدفوعات PayPal",
  "Billing Information": "معلومات الفوترة",
  "Manage billing and subscription settings": "إدارة إعدادات الفوترة والاشتراك",
  "Billing Address": "عنوان الفوترة",
  "Update your billing address": "تحديث عنوان الفوترة الخاص بك",
  "Payment Method": "طريقة الدفع",
  "Manage your payment methods": "إدارة طرق الدفع الخاصة بك",
  "Updating settings...": "جاري تحديث الإعدادات...",
  "You have unsaved changes": "لديك تغييرات غير محفوظة",
  "Settings Refreshed": "تم تحديث الإعدادات",
  "Your settings have been refreshed.": "تم تحديث إعداداتك.",
  "Settings Saved": "تم حفظ الإعدادات",
  "Your settings have been saved successfully.": "تم حفظ إعداداتك بنجاح.",
};

const EN = {
  Settings: "Settings",
  "Manage your website settings and preferences":
    "Manage your website settings and preferences",
  Refresh: "Refresh",
  "Save Changes": "Save Changes",
  "General Settings": "General Settings",
  "User Management": "User Management",
  Security: "Security",
  Customization: "Customization",
  Integrations: "Integrations",
  Billing: "Billing",
  "Site Information": "Site Information",
  "Configure your website details and branding":
    "Configure your website details and branding",
  Localization: "Localization",
  "Configure language and regional settings":
    "Configure language and regional settings",
  "Automatic Language Detection": "Automatic Language Detection",
  "Automatically detect and switch to user's preferred language":
    "Automatically detect and switch to user's preferred language",
  "Right-to-Left Support": "Right-to-Left Support",
  "Enable support for RTL languages": "Enable support for RTL languages",
  "User Management Section": "User Management",
  "Manage user accounts and permissions":
    "Manage user accounts and permissions",
  "Enable User Registration": "Enable User Registration",
  "Allow users to register on the site": "Allow users to register on the site",
  "Require Email Verification": "Require Email Verification",
  "Require users to verify their email addresses":
    "Require users to verify their email addresses",
  Authentication: "Authentication",
  "Configure security and authentication settings":
    "Configure security and authentication settings",
  "Two-Factor Authentication": "Two-Factor Authentication",
  "Require 2FA for admin accounts": "Require 2FA for admin accounts",
  "Strong Passwords": "Strong Passwords",
  "Enforce strong password policy": "Enforce strong password policy",
  "Site Customization": "Site Customization",
  "Customize the look and feel of your site":
    "Customize the look and feel of your site",
  "Enable Dark Mode": "Enable Dark Mode",
  "Allow users to switch to dark mode": "Allow users to switch to dark mode",
  "Custom Logo": "Custom Logo",
  "Upload a custom logo for your site": "Upload a custom logo for your site",
  "Payment Gateways": "Payment Gateways",
  "Configure payment processing integrations":
    "Configure payment processing integrations",
  "Stripe Integration": "Stripe Integration",
  "Process payments via Stripe": "Process payments via Stripe",
  "PayPal Integration": "PayPal Integration",
  "Accept PayPal payments": "Accept PayPal payments",
  "Billing Information": "Billing Information",
  "Manage billing and subscription settings":
    "Manage billing and subscription settings",
  "Billing Address": "Billing Address",
  "Update your billing address": "Update your billing address",
  "Payment Method": "Payment Method",
  "Manage your payment methods": "Manage your payment methods",
  "Updating settings...": "Updating settings...",
  "You have unsaved changes": "You have unsaved changes",
  "Settings Refreshed": "Settings Refreshed",
  "Your settings have been refreshed.": "Your settings have been refreshed.",
  "Settings Saved": "Settings Saved",
  "Your settings have been saved successfully.":
    "Your settings have been saved successfully.",
};

// Helper function for translation
function t(key, lang) {
  if (lang === "ar") return AR[key] || key;
  return EN[key] || key;
}

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

export default function SettingsContent() {
  // Detect language from browser or use English as fallback
  const [lang, setLang] = useState("en");
  const [dir, setDir] = useState("ltr");
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

  // Track if we just switched language to force a remount
  const [langSwitchKey, setLangSwitchKey] = useState(0);
  const prevLang = useRef(lang);

  // Detect language and direction
  useEffect(() => {
    let detectedLang = "en";
    if (typeof window !== "undefined") {
      const navLang =
        window.localStorage.getItem("settings-lang") ||
        window.navigator.language ||
        "en";
      if (navLang.startsWith("ar")) detectedLang = "ar";
    }
    setLang(detectedLang);
    setDir(detectedLang === "ar" ? "rtl" : "ltr");
  }, []);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Force remount when language changes to fix "nothing show when i change into arabic"
  useEffect(() => {
    if (prevLang.current !== lang) {
      setLangSwitchKey((k) => k + 1);
      prevLang.current = lang;
    }
  }, [lang]);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setIsDirty(false);

    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: t("Settings Refreshed", lang),
        description: t("Your settings have been refreshed.", lang),
        variant: "success",
      });
    }, 1000);
  };

  const handleSaveSettings = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      setIsDirty(false);
      toast({
        title: t("Settings Saved", lang),
        description: t("Your settings have been saved successfully.", lang),
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

    // If user enables RTL support, switch to Arabic and RTL
    if (section === "localization" && setting === "rtlSupport" && value) {
      setLang("ar");
      setDir("rtl");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("settings-lang", "ar");
      }
    }
    // If user disables RTL support, switch to English and LTR
    if (section === "localization" && setting === "rtlSupport" && !value) {
      setLang("en");
      setDir("ltr");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("settings-lang", "en");
      }
    }
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

  // Helper for text alignment and direction
  const rtlClass = dir === "rtl" ? "text-right" : "text-left";
  const flexDir = dir === "rtl" ? "flex-row-reverse" : "flex-row";
  const floatDir = dir === "rtl" ? "right" : "left";

  // Wrap the whole content in a keyed div to force remount on lang change
  return (
    <div key={langSwitchKey}>
      <motion.div
        className={`space-y-6`}
        variants={container}
        initial="hidden"
        animate="show"
        dir={dir}
        lang={lang}
        style={{ direction: dir }}
      >
        <motion.div
          variants={item}
          className={`flex flex-col md:${flexDir} md:items-center md:justify-between gap-4`}
        >
          <div className={rtlClass}>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("Settings", lang)}
            </h1>
            <p className="text-muted-foreground">
              {t("Manage your website settings and preferences", lang)}
            </p>
          </div>
          <div
            className={`flex flex-wrap gap-2 ${
              dir === "rtl" ? "justify-start" : ""
            }`}
          >
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2"
              style={dir === "rtl" ? { flexDirection: "row-reverse" } : {}}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {t("Refresh", lang)}
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={isRefreshing || isLoading || !isDirty}
              className="gap-2"
              style={dir === "rtl" ? { flexDirection: "row-reverse" } : {}}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {t("Save Changes", lang)}
            </Button>
          </div>
        </motion.div>

        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className=""
          dir={dir}
        >
          <motion.div variants={item}>
            <TabsList
              className={`grid w-full grid-cols-3 md:grid-cols-6 gap-2`}
            >
              {navigationItems.map((item) => (
                <TabsTrigger
                  key={item.href.replace("#", "")}
                  value={item.href.replace("#", "")}
                  className={`flex items-center gap-2 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t(item.label, lang).split(" ")[0]}
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
                        title={t("Site Information", lang)}
                        description={t(
                          "Configure your website details and branding",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <SiteSettingsForm
                          initialData={settings.siteInfo}
                          onSubmit={(values) => {
                            handleSettingChange(
                              "siteInfo",
                              "name",
                              values.name
                            );
                            handleSettingChange("siteInfo", "url", values.url);
                            handleSettingChange(
                              "siteInfo",
                              "description",
                              values.description
                            );
                          }}
                          lang={lang}
                          dir={dir}
                        />
                      </SectionCard>
                    </motion.div>

                    <motion.div className="mt-4" variants={item}>
                      <SectionCard
                        title={t("Localization", lang)}
                        description={t(
                          "Configure language and regional settings",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Automatic Language Detection", lang)}
                            description={t(
                              "Automatically detect and switch to user's preferred language",
                              lang
                            )}
                            checked={settings.localization.automaticLanguage}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "localization",
                                "automaticLanguage",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("Right-to-Left Support", lang)}
                            description={t(
                              "Enable support for RTL languages",
                              lang
                            )}
                            checked={settings.localization.rtlSupport}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "localization",
                                "rtlSupport",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                        </div>
                      </SectionCard>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            {/* User Management Settings */}
            <TabsContent
              key="users-tab"
              value="users"
              className="space-y-4 mt-6"
            >
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
                        title={t("User Management", lang)}
                        description={t(
                          "Manage user accounts and permissions",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Enable User Registration", lang)}
                            description={t(
                              "Allow users to register on the site",
                              lang
                            )}
                            checked={settings.userManagement.enableRegistration}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "userManagement",
                                "enableRegistration",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("Require Email Verification", lang)}
                            description={t(
                              "Require users to verify their email addresses",
                              lang
                            )}
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
                            lang={lang}
                            dir={dir}
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
                        title={t("Authentication", lang)}
                        description={t(
                          "Configure security and authentication settings",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Two-Factor Authentication", lang)}
                            description={t(
                              "Require 2FA for admin accounts",
                              lang
                            )}
                            checked={settings.security.twoFactorAuth}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "security",
                                "twoFactorAuth",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("Strong Passwords", lang)}
                            description={t(
                              "Enforce strong password policy",
                              lang
                            )}
                            checked={settings.security.strongPasswords}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "security",
                                "strongPasswords",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
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
                        title={t("Site Customization", lang)}
                        description={t(
                          "Customize the look and feel of your site",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Enable Dark Mode", lang)}
                            description={t(
                              "Allow users to switch to dark mode",
                              lang
                            )}
                            checked={settings.customization.darkMode}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "customization",
                                "darkMode",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("Custom Logo", lang)}
                            description={t(
                              "Upload a custom logo for your site",
                              lang
                            )}
                            checked={settings.customization.customLogo}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "customization",
                                "customLogo",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
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
                        title={t("Payment Gateways", lang)}
                        description={t(
                          "Configure payment processing integrations",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Stripe Integration", lang)}
                            description={t("Process payments via Stripe", lang)}
                            checked={settings.integrations.stripe}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "integrations",
                                "stripe",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("PayPal Integration", lang)}
                            description={t("Accept PayPal payments", lang)}
                            checked={settings.integrations.paypal}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "integrations",
                                "paypal",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
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
                        title={t("Billing Information", lang)}
                        description={t(
                          "Manage billing and subscription settings",
                          lang
                        )}
                        className="transition-all duration-200 hover:shadow-md"
                      >
                        <div className="space-y-4">
                          <SettingItem
                            title={t("Billing Address", lang)}
                            description={t("Update your billing address", lang)}
                            checked={settings.billing.billingAddress}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "billing",
                                "billingAddress",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
                          />
                          <SettingItem
                            title={t("Payment Method", lang)}
                            description={t("Manage your payment methods", lang)}
                            checked={settings.billing.paymentMethod}
                            onCheckedChange={(checked) =>
                              handleSettingChange(
                                "billing",
                                "paymentMethod",
                                checked
                              )
                            }
                            lang={lang}
                            dir={dir}
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
              className={`fixed bottom-6 ${
                dir === "rtl" ? "left-6" : "right-6"
              } bg-background/90 backdrop-blur-sm text-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border`}
              style={{ flexDirection: dir === "rtl" ? "row-reverse" : "row" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              dir={dir}
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">
                {t("Updating settings...", lang)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save reminder if there are unsaved changes */}
        <AnimatePresence>
          {isDirty && !isRefreshing && (
            <motion.div
              className={`fixed bottom-6 ${
                dir === "rtl" ? "right-6" : "left-6"
              } bg-background/90 backdrop-blur-sm text-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border border-amber-500`}
              style={{ flexDirection: dir === "rtl" ? "row-reverse" : "row" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              dir={dir}
            >
              <Bell className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">
                {t("You have unsaved changes", lang)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
