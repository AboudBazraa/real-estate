"use client";
import { ReactNode } from "react";
import { useRouteProtection } from "../hooks/useRouteProtection";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * A higher-order component that protects routes based on authentication status
 * and user roles
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo,
  loadingComponent = (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
    </div>
  ),
}: ProtectedRouteProps) {
  const { isLoading, isAuthorized } = useRouteProtection({
    requireAuth,
    allowedRoles,
    redirectTo,
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Show children only if user is authorized
  return isAuthorized ? <>{children}</> : null;
}
