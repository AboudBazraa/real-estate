"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlowEffect } from "@/shared/components/animation/GlowEffect";
import { BackgroundLines } from "@/shared/components/animation/BackgroundLines";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";
import Squares from "@/shared/components/animation/Squares";
import TextPressure from "@/shared/components/animation/TextPressure";
import BlurText from "@/shared/components/animation/BlurText";
import VariableProximity from "@/shared/components/animation/VariableProximity";

// Adding more animation components incrementally
const AnimatedHero = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="w-full h-screen relative overflow-hidden "
      ref={containerRef}
    >
      {/* Background Squares for modern grid effect */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="rgba(260, 260, 260, 0.3)"
          squareSize={50}
          // hoverFillColor="rgba(70, 165, 240, 0.1)"
        />
      </div>
      {/* Background Lines with floating effect */}
      <div className="absolute inset-0 z-1 opacity-20">
        <BackgroundLines
          className="opacity-40"
          svgOptions={{ duration: 20, amplitude: 30 }}
        >
          <></>
        </BackgroundLines>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8 text-center">
        {/* Main Headline with TextPressure for interactive effect */}
        <div className="w-full max-w-4xl h-24 md:h-36 mb-6">
          <TextPressure
            text="DREAM HOME"
            fontFamily="'Roboto Flex', sans-serif"
            fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@100..900&display=swap"
            textColor="#ffffff"
            width={true}
            weight={true}
            italic={false}
            minFontSize={32}
          />
        </div>

        {/* Subtitle with Variable Proximity effect */}
        <div className="mb-8">
          <VariableProximity
            label="DISCOVER YOUR PERFECT PROPERTY"
            fromFontVariationSettings="'wght' 300, 'wdth' 100"
            toFontVariationSettings="'wght' 700, 'wdth' 125"
            containerRef={containerRef}
            radius={100}
            className="text-xl md:text-3xl text-zinc-200 tracking-wider"
          />
        </div>

        {/* Paragraph with BlurText animation */}
        <div className="max-w-3xl mb-12">
          <BlurText
            text="We help you find the perfect property that matches your lifestyle and aspirations. Explore premium listings with our expert guidance."
            animateBy="words"
            delay={100}
            direction="bottom"
            className="text-lg md:text-xl text-zinc-300"
          />
        </div>

        {/* CTA Buttons with GlowEffectButton */}
        <motion.div
          className="flex flex-wrap gap-5 justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <GlowEffectButton
            className="py-3 px-8 rounded-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium text-lg tracking-wide"
            href="/listings"
            text="Browse Properties"
          />

          <GlowEffectButton
            className="py-3 px-8 rounded-full bg-transparent backdrop-blur-sm border border-white/20 text-white font-medium text-lg tracking-wide"
            href="/contact"
            text="Contact Agent"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHero;
