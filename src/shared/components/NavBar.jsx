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
import { usePageTransition } from "./animation/PageTransition";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
// import { ThemeToggle } from "./ThemeToggle";

const getNavItems = (user, handleLogout) => [
  {
    id: 1,
    label: "Menu",
    title: (
      <div className="space-x-2 w-32 flex items-center justify-center">
        <MenuSquare className="h-5 w-5" />
        <p className="font-semibold text-sm">User Menu</p>
      </div>
    ),
    content: (
      <div className="flex flex-col space-y-1 w-full">
        {user ? (
          <div className="py-1 px-3 text-xs text-zinc-400 flex items-center gap-2 mt-1">
            <UserCircle className="h-4 w-4" />
            <span className="truncate">{user.email}</span>
          </div>
        ) : null}
        <Link
          href="/"
          className="relative h-8 w-full scale-100 select-none appearance-none flex items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98] gap-2"
        >
          <HomeIcon className="h-4 w-4" />
          Home
        </Link>
        {user ? (
          <>
            {user.user_metadata?.role &&
            user.user_metadata.role.toLowerCase() === "admin" ? (
              <Link
                href={"/admin"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98] gap-2"
              >
                <MenuSquare className="h-4 w-4" />
                Admin Dashboard
              </Link>
            ) : user.user_metadata?.role?.toLowerCase() === "agent" ? (
              <Link
                href={"/agent"}
                className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98] gap-2"
              >
                <MenuSquare className="h-4 w-4" />
                Agent Dashboard
              </Link>
            ) : null}

            <button
              onClick={handleLogout}
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 dark:hover:bg-zinc-800 dark:hover:text-red-400 focus-visible:ring-2 active:scale-[0.98] gap-2 mt-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98] gap-2"
            >
              <UserCircle className="h-4 w-4" />
              Login
            </Link>
            <Link
              href="/auth/registration"
              className="relative flex h-8 w-full scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 focus-visible:ring-2 active:scale-[0.98] gap-2"
            >
              <UserCircle className="h-4 w-4" />
              Register
            </Link>
            <div className="py-1 px-3 text-xs text-zinc-400 mt-1 flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Sign in to access your account</span>
            </div>
          </>
        )}
      </div>
    ),
  },
  {
    id: 2,
    label: "Theme",
    title: (
      <div className="flex items-center justify-center w-9 h-9 relative">
        <Sun className="h-[1.2rem] w-[1.2rem] absolute transition-all transform rotate-0 scale-100 dark:rotate-0 dark:scale-0 opacity-100 dark:opacity-0" />
        <Moon className="h-[1.2rem] w-[1.2rem] absolute transition-all transform rotate-0 scale-0 dark:rotate-0 dark:scale-100 opacity-0 dark:opacity-100" />
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

function AnimatedLink({ href, className, children, onClick }) {
  const { handleRouteChange, isAnimating } = usePageTransition();

  const handleClick = (e) => {
    // Prevent normal navigation
    e.preventDefault();

    // Skip if already animating
    if (isAnimating) return;

    // Call custom onClick if provided
    if (onClick) onClick(e);

    // Handle route change with animation
    handleRouteChange(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      prefetch={true} // Add prefetch for better performance
    >
      {children}
    </Link>
  );
}

const menuItems = [
  { name: "Buy", href: "/search" },
  { name: "Rent", href: "/search" },
  // { name: "Sell", href: "/search" },
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function MainNav() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const ITEMS = getNavItems(user || null, handleLogout);

  return (
    <motion.nav
      data-state={menuOpen ? "active" : undefined}
      className={`sticky top-0 right-0 left-0 z-[1000] w-full h-16 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-900/90 shadow-md backdrop-blur-lg"
          : "bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md"
      } transition-all duration-300`}
    >
      <div className="m-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
          <div className="flex w-full justify-between lg:w-auto">
            <AnimatedLink
              href="/"
              aria-label="EstateFind Home"
              className="flex items-center space-x-2"
            >
              <span className="font-semibold text-lg">
                Mirage
                <span className="text-zinc-500 dark:text-zinc-400">Estate</span>
              </span>
            </AnimatedLink>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={menuOpen}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu
                  className={`m-auto size-6 duration-200 ${
                    menuOpen ? "rotate-180 scale-0 opacity-0" : ""
                  }`}
                />
                <X
                  className={`absolute inset-0 m-auto size-6 duration-200 ${
                    menuOpen
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-180 scale-0 opacity-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className={`mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/10 md:flex-nowrap lg:m-0 lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:p-0 lg:shadow-none dark:shadow-none active:backdrop-blur-sm ${
              menuOpen ? "block bg-white dark:bg-zinc-900" : "hidden lg:flex"
            }`}
          >
            <div className="lg:pr-4">
              <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <AnimatedLink
                      href={item.href}
                      className={`block duration-150 ${
                        pathname === item.href
                          ? "text-zinc-900 dark:text-white font-medium"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
                      }`}
                    >
                      <span>{item.name}</span>
                    </AnimatedLink>
                  </li>
                ))}
              </ul>
            </div>
            {/* auth //////////////////// */}
            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6 border-l-zinc-400 lg:dark:border-l-zinc-800">
              {user ? (
                <div className="flex items-center gap-2 w-36 relative hidden lg:block">
                  <ToolbarExpandable ITEMS={ITEMS} />
                </div>
              ) : (
                <div className="flex items-center gap-2 w-44">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="px-5 py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-gray-300 dark:border-gray-700"
                  >
                    <AnimatedLink href="/auth/login">
                      <span>Sign In</span>
                    </AnimatedLink>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="px-5 py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-800"
                  >
                    <AnimatedLink href="/auth/registration">
                      <span>Register</span>
                    </AnimatedLink>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
