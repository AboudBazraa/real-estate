"use client";
import Image from "next/image";
import { MainNav } from "../shared/components/NavBar";
import Section from "@/app/components/SectionHero";
import SectionAnmation from "@/app/components/SectionAnmation";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";
import React from "react";
import ParallaxSection from "@/app/components/ParallaxSection";
import { BackgroundLines } from "@/shared/components/animation/BackgroundLines";
import { useAuth } from "@/app/auth/hooks/useAuth";
import Link from "next/link";
import Footer from "@/shared/components/Footer";
import AnimatedHero from "@/app/components/AnimatedHero";
// Wrap Section and SectionAnmation with React.memo if they are pure components
const MemoizedSection = React.memo(Section);
const MemoizedSectionAnmation = React.memo(SectionAnmation);

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="h-screen w-screen px-2 pb-2 bg-zinc-50 text-foreground transition-colors duration-300 dark:bg-black flex flex-col gap-2">
        <div className="bg-black">
          <MainNav />
        </div>
        {/* hero section */}
        <div className="bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border border-zinc-800 h-full rounded-xl overflow-hidden shadow-2xl w-full mx-auto flex flex-col justify-center items-center">
          {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.2)_0,rgba(30,41,59,0)_50%)] w-full h-full"></div> */}
          <div className="flex flex-col items-center justify-center h-full max-w-screen-lg mx-auto">
            {/* <AnimatedHero /> */}
            <ParallaxSection />
          </div>
        </div>
      </div>
      {/* <div className="flex-1">
        <Footer />
      </div> */}
    </>
  );
}
