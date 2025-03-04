import Image from "next/image";
import NavBar from "../shared/components/NavBar";
import Section from "@/app/components/SectionHero";
import SectionAnmation from "@/app/components/SectionAnmation";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";
import React from "react";

// Wrap Section and SectionAnmation with React.memo if they are pure components
const MemoizedSection = React.memo(Section);
const MemoizedSectionAnmation = React.memo(SectionAnmation);

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground transition-colors duration-300 dark:bg-black">
      <NavBar />
      <div className="flex items-center justify-between justify-items-stretch h-full w-full font-geist-sans absolute top-0">
        <div className=" h-full w-20 border-r border-zinc-300 dark:border-zinc-800 border-dashed "></div>
        <main className="pt-16 p-1 h-full w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 h-2/5 w-full justify-between pt-1.5 items-start">
            <GlowEffectButton text={'Get in our website'} className={`mx-3 px-8 rounded-xl font-bold italic tracking-widest`} />
            <MemoizedSection />
          </div>
          <div className="w-full h-3/5 bg-zinc-950 shadow dark:bg-black border-2 border-zinc-300 dark:border-zinc-800 rounded-3xl p-3">
            <MemoizedSectionAnmation />
          </div>
        </main>
        {/* <div className=" w-80 h-full  border-l border-zinc-300 dark:border-zinc-800 border-dashed "></div> */}
      </div>
    </div>
  );
}
