"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { BackgroundLines } from "@/shared/components/animation/BackgroundLines";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";
import Section from "@/app/components/SectionHero";
import React from "react";

const MemoizedSection = React.memo(Section);

export default function ParallaxSection() {
  const { scrollYProgress } = useScroll();

  // Create transform values for parallax zoom effect
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <>
      <div className="h-full w-40 border-r border-zinc-300 dark:border-zinc-800 border-dashed"></div>
      <BackgroundLines>
        <main className="pt-16 p-1 h-full w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 h-full w-full pt-1.5 justify-center items-center">
            <GlowEffectButton
              text={"Get in our website"}
              className={`mx-3 px-8 rounded-xl italic tracking-widest`}
            />
            <MemoizedSection />
            <p className="w-3xl text-sm text-center -m-9 font-playwrite">
              Discover a curated collection of properties designed to fit your
              unique vision. Our dedicated team is here to help you find the
              perfect match—no matter where you are on your real estate journey.
            </p>
          </div>
        </main>
      </BackgroundLines>
      <div className="h-full w-40 border-r border-zinc-300 dark:border-zinc-800 border-dashed"></div>
    </>
  );
}
