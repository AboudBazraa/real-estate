"use client";
import { useRef } from "react";

/**
 * A hook to provide containerRef for VariableProximity component
 */
const useVariableProximity = () => {
  const containerRef = useRef(null);

  return {
    containerRef,
    containerProps: {
      ref: containerRef,
      style: { position: "relative" },
    },
  };
};

export default useVariableProximity;
