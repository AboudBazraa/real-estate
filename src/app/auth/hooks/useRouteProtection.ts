import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Hook to protect routes based on authentication status
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - If true, redirects unauthenticated users
 * @param {string} options.redirectTo - Where to redirect users based on auth status
 * @param {string[]} options.allowedRoles - Optional array of allowed roles
 * @returns {Object} Auth status and loading state
 */
export function useRouteProtection({
  requireAuth = true,
  redirectTo = requireAuth ? "/auth/login" : "/properties",
  allowedRoles = [],
}: {
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // Skip until auth is loaded
    if (loading) return;

    // Get user role from metadata
    const userRole = user?.user_metadata?.role?.toLowerCase() || "user";

    if (requireAuth && !user) {
      // User is not authenticated but the route requires authentication
      router.replace(redirectTo);
    } else if (!requireAuth && user) {
      // User is authenticated but route is only for non-authenticated users (like login page)

      // Determine the appropriate redirect based on user role
      let roleBasedRedirect = "/properties";
      if (userRole === "admin") {
        roleBasedRedirect = "/admin";
      } else if (userRole === "agent") {
        roleBasedRedirect = "/agent";
      }

      router.replace(roleBasedRedirect);
    } else if (requireAuth && user && allowedRoles.length > 0) {
      // Check role-based access if specific roles are allowed
      const hasAllowedRole = allowedRoles.includes(userRole);

      if (!hasAllowedRole) {
        // Redirect to appropriate page based on role
        let roleBasedRedirect = "/properties";
        if (userRole === "admin") {
          roleBasedRedirect = "/admin";
        } else if (userRole === "agent") {
          roleBasedRedirect = "/agent";
        }

        router.replace(roleBasedRedirect);
      } else {
        setIsAuthorized(true);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [user, loading, requireAuth, redirectTo, allowedRoles, router]);

  return {
    isAuthenticated: !!user,
    isAuthorized,
    isLoading: loading,
    userRole: user?.user_metadata?.role || "user",
  };
}
