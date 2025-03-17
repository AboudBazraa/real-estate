import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import Role from "../types/roles";

/**
 * Hook to determine the user's role based on their token
 * @returns {Role} The user's role
 */
export function useRole(): Role {
  const { user, isLoading } = useAuth();
  const [role, setRole] = useState<Role>(Role.USER);

  useEffect(() => {
    if (user && !isLoading) {
      // Get role from user object
      if (user.role === Role.ADMIN) {
        setRole(Role.ADMIN);
      } else if (user.role === Role.AGENT) {
        setRole(Role.AGENT);
      } else {
        setRole(Role.USER);
      }
    }
  }, [user, isLoading]);

  return role;
}
