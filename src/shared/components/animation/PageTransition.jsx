"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { TransitionLayer } from "./TransitionLayer";
import { useTheme } from "next-themes";

// Create context to provide the transition handler
const TransitionContext = createContext(null);

// Hook to access the transition handler
export const usePageTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "usePageTransition must be used within a PageTransition component"
    );
  }
  return context;
};

export const PageTransition = ({ children }) => {
  const elementRef = useRef(null);
  const transitionLayerRef = useRef(null);
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);

  // Set mounted state and track theme
  useEffect(() => {
    setIsMounted(true);
    if (resolvedTheme) {
      setCurrentTheme(resolvedTheme);
    }

    // Preload GSAP for better performance
    if (typeof window !== "undefined") {
      gsap.config({
        autoSleep: 60,
        force3D: true,
        nullTargetWarn: false,
      });
    }
  }, [resolvedTheme]);

  // Function to handle theme change with animation
  const handleThemeChange = useCallback(
    (newTheme) => {
      if (
        !isMounted ||
        isAnimating ||
        !elementRef.current ||
        !transitionLayerRef.current
      ) {
        // If not ready, just switch the theme directly
        setTheme(newTheme);
        return;
      }

      setIsAnimating(true);
      const element = elementRef.current;
      const transitionLayer = transitionLayerRef.current;

      // Set z-index to ensure layer is above content
      gsap.set(transitionLayer, { zIndex: 100 });

      // Create animation timeline
      const themeChangeTl = gsap.timeline({
        onComplete: () => {
          // Switch theme when transition layer is covering the screen
          setTheme(newTheme);

          // Reveal content with new theme
          gsap.to(transitionLayer, {
            y: "-100%",
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              gsap.set(transitionLayer, { zIndex: 50 });
              setIsAnimating(false);
            },
          });
        },
      });

      // Fade out content and bring in transition layer
      themeChangeTl
        .to(element, {
          opacity: 0,
          scale: 0.96,
          y: -15,
          duration: 0.4,
          ease: "power1.in",
        })
        .fromTo(
          transitionLayer,
          { y: "-100%" },
          { y: "0%", duration: 0.8, ease: "power2.inOut" },
          "-=0.2"
        );
    },
    [isMounted, isAnimating, setTheme]
  );

  useEffect(() => {
    // Skip animation if not mounted (server render) or element isn't available
    if (!isMounted || !elementRef.current) return;

    const element = elementRef.current;
    const transitionLayer = transitionLayerRef.current;

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // Initial state setup - ensure transition layer is visible initially
    gsap.set(transitionLayer, {
      y: "0%",
      zIndex: 100,
    });

    // Initial content state - hidden
    gsap.set(element, {
      opacity: 0,
      scale: 0.96,
      y: 15,
    });

    // Get all direct child elements for staggered animation
    const childElements = element.querySelectorAll(":scope > *");

    // Create main timeline for entry animation
    const entryTl = gsap.timeline({
      onComplete: () => {
        // Add a class for any CSS-based animations after the main animation
        if (element) element.classList.add("transition-complete");
        // Ensure transition layer is below content after animation
        gsap.set(transitionLayer, { zIndex: 50 });
      },
    });

    // Sequence: Layer slides up, then content fades in
    entryTl
      // First, slide the transition layer up - with a slight delay for stability
      .to(transitionLayer, {
        y: "-100%",
        duration: 1,
        ease: "power2.inOut",
        delay: 0.1,
      })
      // Then animate the content with staggered effect if there are multiple children
      .to(
        childElements.length > 1 ? childElements : element,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: childElements.length > 1 ? 0.06 : 0,
          ease: "power2.out",
        },
        "-=0.4" // Overlap with layer animation for smoother effect
      );

    // Cleanup function
    return () => {
      entryTl.kill();
    };
  }, [isMounted]); // Only depend on isMounted

  // Function to handle route changes with animation
  const handleRouteChange = async (href) => {
    if (!isMounted) {
      router.push(href);
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      router.push(href);
      return;
    }

    // Prevent multiple animations running at once
    if (isAnimating) return;

    setIsAnimating(true);

    const element = elementRef.current;
    const transitionLayer = transitionLayerRef.current;

    if (!element || !transitionLayer) {
      setIsAnimating(false);
      router.push(href);
      return;
    }

    // Ensure transition layer is above content for exit animation
    gsap.set(transitionLayer, { zIndex: 100 });

    // Create timeline for exit animation
    const exitTl = gsap.timeline({
      onComplete: () => {
        router.push(href);
        setIsAnimating(false);
      },
    });

    // Reset layer position
    gsap.set(transitionLayer, {
      y: "-100%",
    });

    // Get direct child elements for staggered exit
    const childElements = element.querySelectorAll(":scope > *");

    // Sequence: Content fades out, layer slides down
    exitTl
      // First, fade out the content with stagger if multiple children
      .to(childElements.length > 1 ? childElements : element, {
        opacity: 0,
        scale: 0.96,
        y: -15,
        duration: 0.5,
        stagger: childElements.length > 1 ? 0.04 : 0,
        ease: "power1.in",
      })
      // Then slide the transition layer down - make sure it covers everything
      .to(transitionLayer, {
        y: "0%",
        duration: 0.9,
        ease: "power2.inOut",
      });
  };

  // Value to be provided by the context
  const contextValue = {
    handleRouteChange,
    isAnimating,
    currentTheme,
    handleThemeChange,
  };

  // Initial render with no animations
  if (!isMounted) {
    return (
      <TransitionContext.Provider value={contextValue}>
        <TransitionLayer ref={transitionLayerRef} />
        <div ref={elementRef} className="w-full h-full">
          {children}
        </div>
      </TransitionContext.Provider>
    );
  }

  return (
    <TransitionContext.Provider value={contextValue}>
      <TransitionLayer ref={transitionLayerRef} />
      <div
        ref={elementRef}
        className="w-full h-full will-change-transform opacity-0"
      >
        {children}
      </div>
    </TransitionContext.Provider>
  );
};
