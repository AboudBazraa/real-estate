"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function LoadingOverlay() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const randomIncrease = () => Math.random() * 15;
    const timer = setInterval(() => {
      setProgress((prev) => {
        // Slow down progress as it approaches 90%
        const newValue = prev < 90 ? prev + randomIncrease() : prev + 0.5;
        return Math.min(newValue, 99);
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Gradient circle */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 blur-md opacity-20 animate-pulse"></div>

          {/* Loading spinner */}
          <svg className="w-12 h-12 relative" viewBox="0 0 50 50">
            <circle
              className="text-slate-200 dark:text-slate-700"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <motion.circle
              className="text-blue-600 dark:text-blue-400"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDasharray: 150, strokeDashoffset: 150 }}
              animate={{
                strokeDasharray: 150,
                strokeDashoffset: [150, 0],
                transition: {
                  repeat: Infinity,
                  duration: 1.4,
                  ease: "easeInOut",
                },
              }}
            ></motion.circle>
          </svg>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-slate-700 dark:text-slate-300 font-medium">
            Loading properties...
          </p>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-600 rounded-full"
              style={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0.1 }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Finding dream homes for you
          </p>
        </div>
      </div>
    </div>
  );
}
