"use client";
import { useRef } from "react";
import BlurText from "@/shared/components/animation/BlurText.jsx";
// import VariableProximity from "@/shared/components/anmated/VariableProximity";
// import ShinyText from "@/shared/components/anmated/ShinyText";
import { ArrowRight } from 'lucide-react';
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";


const Section = () => {
  const containerRef = useRef(null);
  return (
    <>
      {/* <div  className="border-t-2 pb-6 w-full  border-dashed border-zinc-300 dark:border-zinc-800"></div> */}
      <div >
        <BlurText
          text="Welcome to the future of real estate "
          delay={150}
          animateBy="words"
          direction="top"
          // onAnimationComplete={handleAnimationComplete}
          className="text-5xl mb-8 font-bold italic"
        />
      </div>
    </>
  );
};

export default Section;
