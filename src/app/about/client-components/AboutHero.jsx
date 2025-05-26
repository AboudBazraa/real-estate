"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import BlurText from "@/shared/components/animation/BlurText";

export default function AboutHero() {
  const titleRef = useRef(null);

  useEffect(() => {
    // Animation for the title
    const titleAnimation = gsap.timeline();

    // Make sure the titleRef.current exists before animating
    if (titleRef.current) {
      titleAnimation.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );
    }

    return () => {
      // Cleanup as needed
    };
  }, []);

  return (
    <section className="w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
      <div className="absolute inset-0 dark:bg-black bg-white">
        {/* Triangular masked image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 dark:bg-black bg-white z-0"></div>
            <div
              className="absolute top-0 left-0 w-[65%] sm:w-[70%] md:w-[75%] h-full overflow-hidden z-10"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            >
              <motion.img
                src="images/Bayet.png"
                alt="Modern Interior"
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* About Us Title */}
        <div
          ref={titleRef}
          className="about-title absolute inset-0 flex items-center justify-center z-20"
        >
          {/* <BlurText
            text=" Us"
            className="text-black dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold tracking-wide"
          /> */}
          <BlurText
            className="text-black dark:text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-bold tracking-wide"
            text={
              typeof window !== "undefined" &&
              (document?.documentElement?.lang === "ar" ||
                (typeof navigator !== "undefined" &&
                  navigator.language?.startsWith("ar")))
                ? "من نحن"
                : "About Us"
            }
          />
        </div>
      </div>
    </section>
  );
}
