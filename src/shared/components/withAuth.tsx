"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useToast } from "@/shared/hooks/use-toast";

/**
 * Higher-Order Component for client-side route protection.
 * This provides an additional layer of security beyond middleware
 * and handles cases where middleware might be bypassed.
 *
 * @param Component - The component to be wrapped
 * @param options - Configuration options
 * @returns A protected component
 */
export function withAuth(
  Component: React.ComponentType<any>,
  options: {
    allowedRoles?: string[];
    redirectPath?: string;
  } = {}
) {
  const { allowedRoles = [], redirectPath = "/auth/login" } = options;

  function ProtectedRoute(props: any) {
    const { user, isLoading } = useSupabase();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
      // Wait until auth state is determined
      if (isLoading) return;

      // If user is not authenticated, redirect to login
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to access this page.",
          variant: "destructive",
        });

        // Add the current path as a redirect parameter
        const currentPath = window.location.pathname;
        const redirectUrl = `${redirectPath}?redirectTo=${encodeURIComponent(
          currentPath
        )}`;
        router.push(redirectUrl);
        return;
      }

      // If specific roles are required, verify user has one of them
      if (allowedRoles.length > 0) {
        const userRole = user.user_metadata?.role?.toLowerCase() || "user";

        if (!allowedRoles.includes(userRole)) {
          toast({
            title: "Access denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });

          // Redirect based on user role
          let roleBasedRedirect = "/properties";
          if (userRole === "admin") {
            roleBasedRedirect = "/admin";
          } else if (userRole === "agent") {
            roleBasedRedirect = "/agent";
          }

          router.push(roleBasedRedirect);
          return;
        }
      }
    }, [user, isLoading, router, toast]);

    if (isLoading) {
      // Display a loading indicator while checking auth
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
    }

    // If authenticated (and authorized if roles specified), render the protected component
    return <Component {...props} />;
  }

  // Set display name for debugging
  ProtectedRoute.displayName = `withAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return ProtectedRoute;
}
