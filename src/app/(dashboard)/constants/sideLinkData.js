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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "",
          isActive: true,
        },
        {
          title: "Starred",
          url: "",
          isActive: true,
        },
        {
          title: "Settings",
          url: "",
          isActive: true,
        },
      ],
    },
    {
      title: "Models",
      url: "",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "",
        },
        {
          title: "Explorer",
          url: "",
        },
        {
          title: "Quantum",
          url: "",
        },
      ],
    },
    {
      title: "Documentation",
      url: "",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "",
        },
        {
          title: "Get Started",
          url: "",
        },
        {
          title: "Tutorials",
          url: "",
        },
        {
          title: "Changelog",
          url: "",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Team",
      //     url: "#",
      //   },
      //   {
      //     title: "Billing",
      //     url: "#",
      //   },
      //   {
      //     title: "Limits",
      //     url: "#",
      //   },
      // ],
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
};

export default data;
