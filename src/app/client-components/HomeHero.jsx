"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import BlurText from "@/shared/components/animation/BlurText";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function HomeHero() {
  const heroRef = useRef(null);
  const { locale } = useLanguage();

  useEffect(() => {
    // Hero animation
    const heroTimeline = gsap.timeline();
    heroTimeline.fromTo(
      ".hero-title",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    heroTimeline.fromTo(
      ".hero-subtitle",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    );
    heroTimeline.fromTo(
      ".hero-cta",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative pb-12 sm:pb-16 md:pb-20 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-screen w-full overflow-hidden bg-white dark:bg-black"
    >
      <div className="mx-auto pt-4 sm:pt-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col h-full">
        {/* Legacy Heading */}
        <div className="py-6 sm:py-9 flex flex-col items-center justify-center">
          <h1
            className={`hero-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-light tracking-tight text-zinc-900 dark:text-white${
              locale === "ar" ? " font-cairo" : ""
            }`}
          >
            <BlurText
              text={locale === "ar" ? "مدينة المكلا" : "Our Mukklla "}
              delay={100}
              animateBy={locale === "ar" ? "words" : "letters"}
              direction="top"
              className={`font-light${locale === "ar" ? " font-cairo" : ""}`}
            />
          </h1>
        </div>

        {/* Main Image Section */}
        <div className="flex-grow flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-12 py-4 sm:py-8">
          <div className="w-full overflow-hidden rounded-md shadow-xl dark:shadow-zinc-900/30">
            <div className="w-full h-full overflow-hidden">
              <motion.img
                src="/images/ChatGPTMuklla%20.png"
                alt={locale === "ar" ? "مواد فاخرة" : "Premium Materials"}
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-none"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Description Text and CTA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end py-2 border-t border-zinc-300 dark:border-zinc-800">
          <p
            className={`text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm md:text-base max-w-xl sm:max-w-2xl md:max-w-3xl${
              locale === "ar" ? " font-cairo" : ""
            }`}
          >
            {locale === "ar"
              ? "تمثل مدينة المكلا قمة التصميم، حيث تجمع بين التميز في الجودة  وابتكار الأداء، واختيار المواد بعناية."
              : "Our Mukklla represent the pinnacle of design, combining excellence in quality, performance innovation, and careful selection of materials."}
          </p>
          <div className="mt-4 sm:mt-6 md:mt-0">
            <Button
              variant="outline"
              className="rounded-sm border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 group flex items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm"
            >
              <span className={locale === "ar" ? "font-cairo" : ""}>
                {locale === "ar" ? "عرض التفاصيل" : "See Detail"}
              </span>
              <ArrowRight
                className={`w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform ${
                  locale === "ar"
                    ? "rotate-180 group-hover:translate-x-[-4px]"
                    : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
