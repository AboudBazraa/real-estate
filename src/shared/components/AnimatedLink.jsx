"use client";
import { usePageTransition } from "@/shared/components/animation/PageTransition";
import Link from "next/link";

export function AnimatedLink({ href, children, ...props }) {
  // Try to use the context, but don't crash if it's not available
  let handleTransition;
  try {
    const { handleRouteChange } = usePageTransition();
    handleTransition = handleRouteChange;
  } catch (error) {
    // Context not available, fall back to regular navigation
  }

  const handleClick = (e) => {
    if (handleTransition) {
      e.preventDefault();
      handleTransition(href);
    }
    // If no transition handler, let the link work normally
  };

  return (
    <Link
      href={href}
      onClick={handleTransition ? handleClick : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
