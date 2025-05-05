import { Suspense } from "react";
import { MainNav } from "../shared/components/NavBar";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import Footer from "@/shared/components/Footer";
import ClientHomeSections from "./client-components/ClientHomeSections";
import HomeHero from "./client-components/HomeHero";

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen w-screen text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white flex flex-col relative">
        {/* Navigation */}
          <MainNav />

        {/* Content with padding for fixed navbar */}
        <div className="pt-16">
          <Suspense
            fallback={
              <div className="w-full min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-4 border-zinc-300 border-t-zinc-800 animate-spin"></div>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    Loading content...
                  </p>
                </div>
              </div>
            }
          >
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
