"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { SunMoon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import AddProperty from "./components/add-property";

export default function AddNewPropPage() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                <SunMoon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
      <div className="rounded-xl border border-l-2 border-border/10 dark:border-slate-700 shadow-sm bg-background p-6">
        <AddProperty />
      </div>
    </motion.div>
  );
}
