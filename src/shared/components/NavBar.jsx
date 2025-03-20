"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  ChevronDown,
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
          className="relative h-8 w-full scale-100 select-none appearance-none flex items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
        >
          Home
        </Link>
        {user ? (
          <>
            {user.user_metadata?.role === "Admin" ? (
              <Link
                href={"/admin"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href={"/agent"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
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
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
            >
              Login
            </Link>
            <Link
              href="/auth/registration"
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98]"
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
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`h-16 sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-900/90 shadow-md"
          : "dark:bg-zinc-950/5 border-b border-zinc-300 dark:border-zinc-800 border-dashed"
      } dark:text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-2xl font-extrabold bg-clip-text font-playwrite text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300"
            >
              Almukalla
            </Link>
          </motion.div>

          {/* Mobile menu button - only shown on small screens */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm hover:text-zinc-800 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm hover:text-zinc-800 dark:hover:text-white transition-colors"
            >
              Properties
            </Link>
            <Link
              href="/interactive-map"
              className="text-sm hover:text-zinc-800 dark:hover:text-white transition-colors"
            >
              Map
            </Link>
            <Link
              href="/about"
              className="text-sm hover:text-zinc-800 dark:hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                    {user.email && user.email[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.user_metadata?.username || user.email.split("@")[0]}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {user.user_metadata?.role || "User"}
                    </span>
                  </div>
                </div>

                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Account <ChevronDown className="h-4 w-4" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                    {user.user_metadata?.role === "Admin" ? (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/agent"
                        className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/registration">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Sign up
                  </Button>
                </Link>
              </div>
            )}

            <Mode />
          </div>

          {/* Mobile menu - only visible on small screens */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-16 left-0 right-0 bg-white dark:bg-zinc-900 shadow-lg rounded-b-md lg:hidden z-50 overflow-hidden"
              >
                <div className="flex flex-col p-4 space-y-4">
                  <Link
                    href="/"
                    className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/properties"
                    className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Properties
                  </Link>
                  <Link
                    href="/interactive-map"
                    className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Map
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>

                  {user ? (
                    <>
                      {user.user_metadata?.role === "Admin" ? (
                        <Link
                          href="/admin"
                          className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/agent"
                          className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="text-sm p-2 text-left text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/auth/login"
                        className="text-sm p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/registration"
                        className="text-sm bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Link>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <Mode />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Original toolbar for tablet and below (keeping for compatibility) */}
          <div className="lg:hidden flex items-center gap-4">
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                  {user.email && user.email[0].toUpperCase()}
                </div>
              </motion.div>
            )}
            <div className="flex">
              <ToolbarExpandable ITEMS={ITEMS} />
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default NavBar;
