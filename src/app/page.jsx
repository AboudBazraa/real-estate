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
// Wrap Section and SectionAnmation with React.memo if they are pure components
const MemoizedSection = React.memo(Section);
const MemoizedSectionAnmation = React.memo(SectionAnmation);

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="h-screen w-screen relative bg-background text-foreground transition-colors duration-300 dark:bg-black overflow-hidden">
      <MainNav />
      <div className="flex items-center justify-between justify-items-stretch h-full w-full font-geist-sans absolute top-0 p-2">
        <section className="flex items-center justify-between justify-items-stretch h-full w-1/2 font-geist-sans">
          <ParallaxSection />
          {!user && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <Link href="/auth/login">
                <GlowEffectButton>Get Started</GlowEffectButton>
              </Link>
            </div>
          )}
        </section>
        <section className="bg-amber-400 h-full sm:w-1/2 flex rounded-xl"></section>
      </div>
    </div>
  );
}
