import { GlowEffect } from "@/shared/components/animation/GlowEffect";
import { ArrowUpRight } from "lucide-react";

export function GlowEffectButton({ className, text, ...props }: any) {
  return (
    <div className="relative">
      <GlowEffect
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        mode="colorShift"
        blur="soft"
        duration={3}
        scale={0.9}
      />
      <button
        className={`relative inline-flex items-center gap-1 bg-zinc-950  px-2.5 py-1.5 text-sm text-zinc-50 outline-1 outline-[#fff2f21f] ${className}`}
        {...props}
      >
        {text} <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}
