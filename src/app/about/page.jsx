import { Suspense } from "react";
import { PageTransition } from "@/shared/components/animation/PageTransition";
import { MainNav } from "@/shared/components/NavBar";
import Spinner from "@/shared/components/ui/spinner";
import Footer from "@/shared/components/Footer";
import AboutHero from "./client-components/AboutHero";
import AboutContent from "./client-components/AboutContent";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black">
        {/* Navigation */}
        <MainNav />

        {/* Content with padding for fixed navbar */}
        <div className="pt-16">
          {/* Hero Section */}
          <Suspense
            fallback={
              <div className="w-full h-[50vh] flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            }
          >
            <AboutHero />
          </Suspense>

          {/* About Content */}
          <Suspense
            fallback={
              <div className="w-full min-h-[30vh] flex items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <AboutContent />
          </Suspense>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </PageTransition>
  );
}
