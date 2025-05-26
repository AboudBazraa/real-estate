"use client";
import {
  Settings2,
  Home,
  Building,
  Users,
  CreditCard,
  Calendar,
  UserCircle,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import Roles from "@/app/auth/types/roles";

const isActive = (url, currentUrl) => currentUrl === url;

// Translations for the sidebar
const translations = {
  en: {
    // Admin translations
    admin: {
      dashboard: "Dashboard",
      propertiesManagement: "Properties Management",
      allListings: "All Listings",
      pendingApprovals: "Pending Approvals",
      categoriesTypes: "Categories & Types",
      usersManagement: "Users Management",
      listingsAllUser: "Listings All User",
      allUsersPermissions: "All Users Permissions",
      adminRoles: "Admin & Roles",
      transactionsPayments: "Transactions & Payments",
      subscriptionPlans: "Subscription Plans",
      paymentsInvoices: "Payments & Invoices",
      agentCommissions: "Agent Commissions",
      settings: "Settings",
      support: "Support",
      feedback: "Feedback",
    },
    // Agent translations
    agent: {
      dashboard: "Dashboard",
      myProperties: "My Properties",
      viewAllProperties: "View All Properties",
      addNewProperty: "Add New Property",
      appointmentsMeetings: "Appointments & Meetings",
      scheduledVisits: "Scheduled Visits",
      meetingRequests: "Meeting Requests",
      profileSettings: "Profile & Settings",
      editProfile: "Edit Profile",
      support: "Support",
      feedback: "Feedback",
    },
  },
  ar: {
    // Admin translations
    admin: {
      dashboard: "لوحة المعلومات",
      propertiesManagement: "إدارة العقارات",
      allListings: "جميع القوائم",
      pendingApprovals: "الموافقات المعلقة",
      categoriesTypes: "الفئات والأنواع",
      usersManagement: "إدارة المستخدمين",
      listingsAllUser: "قوائم جميع المستخدمين",
      allUsersPermissions: "صلاحيات جميع المستخدمين",
      adminRoles: "المشرفين والأدوار",
      transactionsPayments: "المعاملات والمدفوعات",
      subscriptionPlans: "خطط الاشتراك",
      paymentsInvoices: "المدفوعات والفواتير",
      agentCommissions: "عمولات الوكلاء",
      settings: "الإعدادات",
      support: "الدعم",
      feedback: "التعليقات",
    },
    // Agent translations
    agent: {
      dashboard: "لوحة المعلومات",
      myProperties: "عقاراتي",
      viewAllProperties: "عرض جميع العقارات",
      addNewProperty: "إضافة عقار جديد",
      appointmentsMeetings: "المواعيد والاجتماعات",
      scheduledVisits: "الزيارات المجدولة",
      meetingRequests: "طلبات الاجتماع",
      profileSettings: "الملف الشخصي والإعدادات",
      editProfile: "تعديل الملف الشخصي",
      support: "الدعم",
      feedback: "التعليقات",
    },
  },
};

// Export a function that returns the sidebar data with the appropriate translations
const getSidebarData = (language = "en") => {
  // Default to English if language is not provided or not supported
  const currentLanguage = translations[language] ? language : "en";
  const t = translations[currentLanguage];
  const isRTL = currentLanguage === "ar";

  // RTL-specific styling and classes
  const rtlProps = isRTL
    ? {
        className: "rtl",
        iconPosition: "left", // Changed from "right" to "left" so icons start from the left in Arabic
        textAlign: "right",
        menuItemClass: "flex-row-reverse justify-between",
        submenuClass: "rtl-submenu border-r-0 border-l mr-0 ml-2",
      }
    : {};

  return {
    [Roles.ADMIN]: {
      user: {
        name: "admin",
        email: "m@admin.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: t.admin.dashboard,
          url: "/admin",
          icon: Home,
          isActive,
          rtl: false, // Force LTR in Arabic
        },
        {
          title: t.admin.propertiesManagement,
          url: "/admin/propertyList",
          icon: Building,
          isActive,
          rtl: false,
          items: [
            {
              title: t.admin.allListings,
              url: "/admin/propertyList",
              rtl: false,
            },
            {
              title: t.admin.pendingApprovals,
              url: "/admin/pending",
              rtl: false,
            },
            {
              title: t.admin.categoriesTypes,
              url: "/admin/categories",
              rtl: false,
            },
          ],
        },
        {
          title: t.admin.usersManagement,
          url: "/admin/userList",
          icon: Users,
          isActive,
          rtl: false,
          items: [
            {
              title: t.admin.listingsAllUser,
              url: "/admin/userList",
              rtl: false,
            },
            {
              title: t.admin.allUsersPermissions,
              url: "/admin/permissions",
              rtl: false,
            },
            {
              title: t.admin.adminRoles,
              url: "/admin/roles",
              rtl: false,
            },
          ],
        },
        {
          title: t.admin.transactionsPayments,
          url: "/admin/subscriptions",
          icon: CreditCard,
          isActive,
          rtl: false,
          items: [
            {
              title: t.admin.subscriptionPlans,
              url: "/admin/subscriptions",
              rtl: false,
            },
            {
              title: t.admin.paymentsInvoices,
              url: "/admin/payments",
              rtl: false,
            },
            {
              title: t.admin.agentCommissions,
              url: "/admin/commissions",
              rtl: false,
            },
          ],
        },
        {
          title: t.admin.settings,
          url: "/admin/settings",
          icon: Settings2,
          isActive,
          rtl: false,
        },
      ],
      navSecondary: [],
      projects: [],
    },
    [Roles.AGENT]: {
      user: {
        name: "Agent",
        email: "m@agent.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: t.agent.dashboard,
          url: "/agent",
          icon: Home,
          isActive,
          rtl: false, // Force LTR in Arabic
          ...rtlProps,
        },
        {
          title: t.agent.myProperties,
          url: "/agent/agentProperties",
          icon: Building,
          isActive,
          rtl: false,
          ...rtlProps,
          items: [
            {
              title: t.agent.viewAllProperties,
              url: "/agent/agentProperties",
              rtl: false,
              ...rtlProps,
            },
            {
              title: t.agent.addNewProperty,
              url: "/agent/addNewProp",
              rtl: false,
              ...rtlProps,
            },
          ],
        },
        {
          title: t.agent.appointmentsMeetings,
          url: "/agent/meetings",
          icon: Calendar,
          isActive,
          rtl: false,
          ...rtlProps,
          items: [
            {
              title: t.agent.scheduledVisits,
              url: "/agent/meetings",
              rtl: false,
              ...rtlProps,
            },
            {
              title: t.agent.meetingRequests,
              url: "/agent/request",
              rtl: false,
              ...rtlProps,
            },
          ],
        },
        {
          title: t.agent.profileSettings,
          url: "/agent/profile",
          icon: UserCircle,
          isActive,
          rtl: false,
          ...rtlProps,
          items: [
            {
              title: t.agent.editProfile,
              url: "/agent/profile",
              rtl: false,
              ...rtlProps,
            },
          ],
        },
      ],
      navSecondary: [
        {
          title: t.agent.support,
          url: "#",
          icon: HelpCircle,
          rtl: false,
          ...rtlProps,
        },
        {
          title: t.agent.feedback,
          url: "#",
          icon: MessageSquare,
          rtl: false,
          ...rtlProps,
        },
      ],
      projects: [],
    },
  };
};

export default getSidebarData;
