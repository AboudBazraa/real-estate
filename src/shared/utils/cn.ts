import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge multiple class names with Tailwind CSS support
 * @param inputs - Class names or conditional class objects to merge
 * @returns A single string of merged class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
