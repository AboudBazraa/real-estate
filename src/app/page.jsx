"use client";

import { Suspense } from "react";
import { MainNav } from "../shared/components/NavBar";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import Footer from "@/shared/components/Footer";
import ClientHomeSections from "./client-components/ClientHomeSections";
import HomeHero from "./client-components/HomeHero";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function Home() {
  const { locale } = useLanguage();

  // Create a reusable loading component
  const LoadingIndicator = () => (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-zinc-300 border-t-zinc-800 animate-spin"></div>
        <p className="text-zinc-500 dark:text-zinc-400">
          {locale === "ar" ? "جاري تحميل المحتوى..." : "Loading content..."}
        </p>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen w-screen text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white flex flex-col relative">
        {/* Navigation */}
        <MainNav />

        {/* Content with padding for fixed navbar */}
        <div className="pt-6">
          <Suspense fallback={<LoadingIndicator />}>
            {/* Hero Section */}
            <HomeHero />

            {/* All other interactive sections */}
            <ClientHomeSections />
          </Suspense>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
}
