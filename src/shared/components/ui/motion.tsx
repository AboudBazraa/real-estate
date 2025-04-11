"use client";

import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const skeletonPulse = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 0.8, 0.6],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  },
};

interface MotionContainerProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionDiv({
  children,
  className = "",
  delay = 0,
  ...props
}: MotionContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionDivUp({
  children,
  className = "",
  delay = 0,
  ...props
}: MotionContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionDivLeft({
  children,
  className = "",
  delay = 0,
  ...props
}: MotionContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeInLeft}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionButton({
  children,
  className = "",
  ...props
}: MotionContainerProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function MotionList({
  children,
  className = "",
  ...props
}: MotionContainerProps) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className={className}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

export function MotionListItem({
  children,
  className = "",
  ...props
}: MotionContainerProps) {
  return (
    <motion.li variants={fadeInUp} className={className} {...props}>
      {children}
    </motion.li>
  );
}
