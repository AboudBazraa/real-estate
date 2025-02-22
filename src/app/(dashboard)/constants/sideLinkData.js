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
import Roles from '@/app/auth/types/roles';

const sidebarData = {
  [Roles.ADMIN]: {
    user: {
        name: "admin",
        email: "m@admin.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: "Playground",
          url: "/admin",
          icon: SquareTerminal,
          isActive: (url, currentUrl) => currentUrl === url,
        },
        {
          title: "Properties Management",
          url: "",
          icon: Bot,
          isActive: (url, currentUrl) => currentUrl === url,
          items: [
            {
              title: "All Listings",
              url: "",
            },
            {
              title: "Pending Approvals",
              url: "",
            },
            {
              title: "Categories & Types",
              url: "",
            },
          ],
        },
        {
          title: "Users Management",
          url: "",
          icon: BookOpen,
          items: [
            {
              title: "Users Permissions",
              url: "",
            },
            {
              title: "Admin & Roles",
              url: "",
            },
          ],
        },
        {
          title: "Agents Management",
          url: "",
          icon: BookOpen,
          items: [
            {
              title: "Agents Listings",
              url: "",
            },
            {
              title: "Agent Permissions",
              url: "",
            },
          ],
        },
        {
          title: "Transactions & Payments",
          url: "",
          icon: BookOpen,
          items: [
            {
              title: "Subscription Plans (if applicable)",
              url: "",
            },
            {
              title: "Payments & Invoices",
              url: "",
            },
            {
              title: "Agent Commissions",
              url: "",
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
          name: "Reports & Analytics",
          url: "#",
          icon: Frame,
        },
        {
          name: "Sales & Marketing",
          url: "#",
          icon: PieChart,
        },
        {
          name: "FAQs",
          url: "#",
          icon: Map,
        },
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