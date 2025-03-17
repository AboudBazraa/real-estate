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
        icon: SquareTerminal,
        isActive,
      },
      {
        title: "Properties Management",
        url: "/admin/propertyList",
        icon: Bot,
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
        icon: BookOpen,
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
        icon: BookOpen,
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
        icon: SquareTerminal,
        isActive,
      },
      {
        title: "My Properties",
        url: "/agent/agentProperties",
        icon: Bot,
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
        icon: BookOpen,
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
        icon: Settings2,
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
