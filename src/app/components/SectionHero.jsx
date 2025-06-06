"use client";
import { useRef } from "react";
import BlurText from "@/shared/components/animation/BlurText.jsx";
// import VariableProximity from "@/shared/components/anmated/VariableProximity";
// import ShinyText from "@/shared/components/anmated/ShinyText";
import { ArrowRight } from "lucide-react";
import { GlowEffectButton } from "@/shared/components/animation/GlowEffectButton";

const Section = () => {
  const containerRef = useRef(null);
  return (
    <>
      {/* <div  className="border-t-2 pb-6 w-full  border-dashed border-zinc-300 dark:border-zinc-800"></div> */}
      <div className="flex justify-center items-center w-full flex-col">
        <BlurText
          text={`Welcome to our website`}
          delay={150}
          animateBy="words"
          direction="top"
          // onAnimationComplete={handleAnimationComplete}
          className="text-5xl font-sigmar text-white"
        />
      </div>
    </>
  );
};

export default Section;
