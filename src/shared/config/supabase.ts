/**
 * Supabase Configuration Helper
 *
 * This file provides constants and utilities for Supabase configuration
 * Check these settings to ensure authentication emails are working correctly
 */

// Base Supabase URLs for your project
export const SUPABASE_CONFIG = {
  // This should match your Supabase project URL
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,

  // This should be your anon/public key
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

  // Email redirect settings
  // Update this to match your actual confirmation page path
  redirectUrl: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`
    : typeof window !== "undefined"
    ? `${window.location.origin}/auth/confirm`
    : "",

  // Function to check if required configuration exists
  checkConfig: () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
      return false;
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error(
        "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable"
      );
      return false;
    }

    return true;
  },
};
