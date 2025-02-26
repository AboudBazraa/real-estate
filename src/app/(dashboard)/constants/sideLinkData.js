"use client";
import {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
} from "lucide-react";
import Roles from "@/app/auth/types/roles";

const sidebarData = {
  [Roles.ADMIN]: {
    user: {
      name: "admin",
      email: "m@admin.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: SquareTerminal,
        isActive: (url, currentUrl) => currentUrl === url,
      },

      {
        title: "Properties Management",
        url: "/admin/propertyList",
        icon: Bot,
        isActive: (url, currentUrl) => currentUrl === url,
        items: [
          {
            title: "All Listings",
            url: "/admin/propertyList",
          },
          {
            title: "Pending Approvals",
            url: "/admin/propertyList/pending",
          },
          {
            title: "Categories & Types",
            url: "/admin/propertyList/categories",
          },
        ],
      },
      {
        title: "Users Management",
        url: "/admin/userList",
        icon: BookOpen,
        isActive: (url, currentUrl) => currentUrl === url,
        items: [
          {
            title: "Listings All User ",
            url: "/admin/userList",
          },
          {
            title: "All Users Permissions",
            url: "/admin/userList/permissions",
          },
          {
            title: "Admin & Roles",
            url: "/admin/userList/roles",
          },
        ],
      },
      {
        title: "Transactions & Payments",
        url: "/admin/transactions/subscriptions",
        icon: BookOpen,
        isActive: (url, currentUrl) => currentUrl === url,
        items: [
          {
            title: "Subscription Plans",
            url: "/admin/transactions/subscriptions",
          },
          {
            title: "Payments & Invoices",
            url: "/admin/transactions/payments",
          },
          {
            title: "Agent Commissions",
            url: "/admin/transactions/commissions",
          },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings2,
      },
    ],
    navSecondary: [
      // {
      //   title: "Support",
      //   url: "#",
      //   icon: LifeBuoy,
      // },
      // {
      //   title: "Feedback",
      //   url: "#",
      //   icon: Send,
      // },
    ],
    projects: [
      // {
      //   name: "Reports & Analytics",
      //   url: "#",
      //   icon: Frame,
      // },
      // {
      //   name: "Sales & Marketing",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "FAQs",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  },
  [Roles.AGENT]: {
    user: {
      name: "Agent",
      email: "m@agent.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Playground",
        url: "/admin",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "My Properties",
        url: "",
        icon: Bot,
        items: [
          {
            title: "View All Properties",
            url: "",
          },
          {
            title: "Add New Property",
            url: "",
          },
          {
            title: "Edit Listings",
            url: "",
          },
        ],
      },
      {
        title: "Appointments & Meetings",
        url: "",
        icon: BookOpen,
        items: [
          {
            title: "Scheduled Visits",
            url: "",
          },
          {
            title: "Meeting Requests",
            url: "",
          },
        ],
      },
      {
        title: "Profile & Settings ",
        url: "/admin/settings",
        icon: Settings2,
        items: [
          {
            title: "Edit Profile",
            url: "#",
          },
          {
            title: "Change Password",
            url: "#",
          },
          {
            title: "Notification Preferences",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings2,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  },
};

export default sidebarData;
