"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

export default function HomeLoadingIndicator() {
  const { locale } = useLanguage();

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-300 border-t-zinc-800 animate-spin"></div>
        <p className="text-zinc-500 dark:text-zinc-400">
          {locale === "ar" ? "جاري تحميل المحتوى..." : "Loading content..."}
        </p>
      </div>
    </div>
  );
}
