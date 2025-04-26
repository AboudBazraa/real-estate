import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import Roles from "../types/roles";
import { useEffect } from "react";

export const RoleProtectedRoute = ({
  requiredRole,
  children,
}: {
  requiredRole: Roles;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && user.role !== requiredRole) {
      router.push("/auth");
    }
  }, [user, router, requiredRole, loading]);

  if (!user || user.role !== requiredRole) {
    return null; // or return a loading spinner
  }

  return children;
};
