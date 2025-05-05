import React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * A responsive container component that provides consistent spacing and max-width
 * across the application.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render inside the container
 * @param {string} props.className - Additional classes to apply to the container
 * @param {boolean} props.fluid - Whether the container should be full width on all screens
 * @param {string} props.as - The element type to render the container as
 * @param {boolean} props.noPadding - Whether to remove the default padding
 */
export default function ResponsiveContainer({
  children,
  className,
  fluid = false,
  as: Component = "div",
  noPadding = false,
  ...props
}) {
  return (
    <Component
      className={cn(
        "w-full",
        !noPadding && "px-4 sm:px-6 md:px-8 lg:px-12",
        !fluid && "mx-auto container",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
