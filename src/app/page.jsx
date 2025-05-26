import { Suspense } from "react";
import { MainNav } from "../shared/components/NavBar";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import Footer from "@/shared/components/Footer";
import ClientHomeSections from "./client-components/ClientHomeSections";
import HomeHero from "./client-components/HomeHero";
import HomeLoadingIndicator from "./client-components/HomeLoadingIndicator";

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen w-screen text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white flex flex-col relative">
        {/* Navigation */}
        <MainNav />

        {/* Content with padding for fixed navbar */}
        <div className="pt-6">
          <Suspense fallback={<HomeLoadingIndicator />}>
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
