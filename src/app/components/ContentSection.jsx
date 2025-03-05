'use client'

import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

export default function ContentSection({ children, index }) {
  const { scrollYProgress } = useScroll();
  
  // Different effects based on section index
  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    index % 2 === 0 ? [100, -100] : [-100, 100]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.section
      style={{ opacity, y: yOffset }}
      className="min-h-screen w-full flex items-center justify-center relative"
    >
      {children}
    </motion.section>
  );
} 