import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  // Format large numbers with K (thousands) or M (millions) suffix
  if (amount >= 1000000) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount / 1000000);

    // Remove decimal if it's .0
    return formatted.replace(/\.0/, "") + "M";
  } else if (amount >= 1000) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(amount / 1000);

    // Remove decimal if it's .0
    return formatted.replace(/\.0/, "") + "K";
  } else {
    // For smaller numbers, use standard formatting without decimal places
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}
