"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mode } from "./ui/modetoggle";
import { useToast } from "../hooks/use-toast";
import { Button } from "./ui/button";
import ToolbarExpandable from "./animation/ToolbarExpandable";
import {
  MenuSquare,
  HomeIcon,
  Sun,
  Moon,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/app/auth/hooks/useAuth";

const getNavItems = (user, handleLogout) => [
  {
    id: 1,
    label: "Menu",
    title: (
      <div className="space-x-2 w-32 flex items-center justify-center">
        <MenuSquare className="h-5 w-5" />
        <p className="">Menu</p>
      </div>
    ),
    content: (
      <div className="flex flex-col space-y-1 w-full">
        <Link
          href="/"
          className="relative h-8 w-full scale-100 select-none appearance-none flex items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]"
        >
          Home
        </Link>
        {user ? (
          <>
            {user.role === "Admin" ? (
              <Link
                href={"/admin"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href={"/agent"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]"
              >
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 focus-visible:ring-2 active:scale-[0.98] gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]"
            >
              Login
            </Link>
            <Link
              href="/auth/registration"
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]"
            >
              Register
            </Link>
          </>
        )}
      </div>
    ),
  },
  {
    id: 2,
    label: "Theme",
    title: (
      <div className="flex items-center justify-center w-9 h-9">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </div>
    ),
    content: (
      <div className="flex flex-col space-y-1">
        <Mode />
      </div>
    ),
  },
];

function NavBar() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ITEMS = getNavItems(user, handleLogout);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="dark:bg-zinc-950/5 h-16 border-b border-zinc-300 dark:border-zinc-800 border-dashed dark:text-white sticky top-0 z-50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full relative">
          {/* <HomeIcon className="h-6 w-6" /> */}
          {/* <ModeToggle/> */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-2xl font-extrabold bg-clip-text font-playwrite"
            >
              Almukalla
            </Link>
          </motion.div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex gap-14">
              <ToolbarExpandable ITEMS={ITEMS} />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default NavBar;
