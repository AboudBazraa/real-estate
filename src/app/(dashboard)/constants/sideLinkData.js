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
        icon: Home,
        isActive,
      },
      {
        title: "Properties Management",
        url: "/admin/propertyList",
        icon: Building,
        isActive,
        items: [
          {
            title: "All Listings",
            url: "/admin/propertyList",
          },
          {
            title: "Pending Approvals",
            url: "/admin/pending",
          },
          {
            title: "Categories & Types",
            url: "/admin/categories",
          },
        ],
      },
      {
        title: "Users Management",
        url: "/admin/userList",
        icon: Users,
        isActive,
        items: [
          {
            title: "Listings All User ",
            url: "/admin/userList",
          },
          {
            title: "All Users Permissions",
            url: "/admin/permissions",
          },
          {
            title: "Admin & Roles",
            url: "/admin/roles",
          },
        ],
      },
      {
        title: "Transactions & Payments",
        url: "/admin/subscriptions",
        icon: CreditCard,
        isActive,
        items: [
          {
            title: "Subscription Plans",
            url: "/admin/subscriptions",
          },
          {
            title: "Payments & Invoices",
            url: "/admin/payments",
          },
          {
            title: "Agent Commissions",
            url: "/admin/commissions",
          },
        ],
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings2,
        isActive,
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
        title: "Dashboard",
        url: "/agent",
        icon: Home,
        isActive,
      },
      {
        title: "My Properties",
        url: "/agent/agentProperties",
        icon: Building,
        isActive,
        items: [
          {
            title: "View All Properties",
            url: "/agent/agentProperties",
          },
          {
            title: "Add New Property",
            url: "/agent/addNewProp",
          },
        ],
      },
      {
        title: "Appointments & Meetings",
        url: "/agent/meetings",
        icon: Calendar,
        isActive,
        items: [
          {
            title: "Scheduled Visits",
            url: "/agent/meetings",
          },
          {
            title: "Meeting Requests",
            url: "/agent/request",
          },
        ],
      },
      {
        title: "Profile & Settings ",
        url: "/agent/profile", // Corrected URL
        icon: UserCircle,
        isActive,
        items: [
          {
            title: "Edit Profile",
            url: "/agent/profile",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: HelpCircle,
      },
      {
        title: "Feedback",
        url: "#",
        icon: MessageSquare,
      },
    ],
    projects: [
      // {
      //   name: "Design Engineering",
      //   url: "#",
      //   icon: Frame,
      // },
      // {
      //   name: "Sales & Marketing",
      //   url: "#",
      //   icon: PieChart,
      // },
      // {
      //   name: "Travel",
      //   url: "#",
      //   icon: Map,
      // },
    ],
  },
};

export default sidebarData;
