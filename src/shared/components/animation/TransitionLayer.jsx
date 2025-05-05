"use client";
import { forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const TransitionLayer = forwardRef((props, ref) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to enable theme detection on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme only on client side to avoid hydration mismatch
  const currentTheme = mounted ? resolvedTheme : "light";

  // Dynamically set colors based on theme
  const getColors = () => {
    if (!mounted)
      return {
        gradient: "from-blue-600 via-blue-500 to-blue-600",
        bgStyle: "linear-gradient(to bottom, #2563eb, #3b82f6, #2563eb)",
        glowColor: "rgba(56,189,248,0.4)",
        lineColor: "via-blue-200",
      };

    return currentTheme === "dark"
      ? {
          gradient: "from-indigo-900 via-blue-800 to-indigo-900",
          bgStyle: "linear-gradient(to bottom, #1e3a8a, #1e40af, #1e3a8a)",
          glowColor: "rgba(56,189,248,0.5)",
          lineColor: "via-blue-300",
        }
      : {
          gradient: "from-blue-600 via-blue-500 to-blue-600",
          bgStyle: "linear-gradient(to bottom, #2563eb, #3b82f6, #2563eb)",
          glowColor: "rgba(56,189,248,0.4)",
          lineColor: "via-blue-200",
        };
  };

  const { gradient, bgStyle, glowColor, lineColor } = getColors();

  return (
    <div
      ref={ref}
      className={`fixed inset-0 transform translate-y-0 pointer-events-none bg-gradient-to-b ${gradient} will-change-transform`}
      style={{
        background: bgStyle,
        // Add a small amount of extra height to prevent any visible gaps
        height: "calc(100% + 5px)",
        top: "-2px",
        bottom: "-3px",
      }}
      data-theme={currentTheme}
      {...props}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00TTI0IDM0YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wLTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNE0xMiAzNGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtMC0xNmMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTQiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>

      {/* Light rays - enhanced with shadow for better visual effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor} 0%, transparent 70%)`,
        }}
      ></div>

      {/* Horizontal glowing lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/3 w-full h-[1px] bg-gradient-to-r from-transparent ${lineColor}/70 to-transparent transform -translate-x-full animate-[slide-in-out_4s_ease-in-out_infinite]`}
        ></div>
        <div
          className={`absolute top-1/2 w-full h-[2px] bg-gradient-to-r from-transparent ${lineColor}/80 to-transparent transform -translate-x-full animate-[slide-in-out_4s_ease-in-out_infinite_1.5s]`}
        ></div>
        <div
          className={`absolute top-2/3 w-full h-[1px] bg-gradient-to-r from-transparent ${lineColor}/70 to-transparent transform -translate-x-full animate-[slide-in-out_4s_ease-in-out_infinite_3s]`}
        ></div>
      </div>
    </div>
  );
});

// Display name for React DevTools
TransitionLayer.displayName = "TransitionLayer";
