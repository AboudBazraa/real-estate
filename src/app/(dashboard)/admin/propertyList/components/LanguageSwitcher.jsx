"use client";

import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

const LanguageSwitcher = () => {
  const { changeLanguage, currentLanguage, isRTL } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Only show the language switcher after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage === "ar" ? "العربية" : "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={isRTL ? "rtl" : ""}>
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className={`${
            currentLanguage === "en"
              ? "bg-slate-100 dark:bg-slate-800 font-medium"
              : ""
          } ${isRTL ? "flex-row-reverse text-right" : ""}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className={`${
            currentLanguage === "ar"
              ? "bg-slate-100 dark:bg-slate-800 font-medium"
              : ""
          } ${isRTL ? "flex-row-reverse text-right" : ""}`}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
