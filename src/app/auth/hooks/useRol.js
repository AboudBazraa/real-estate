import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import Roles from "../types/roles";

/**
 * Hook to determine the user's role based on metadata from Supabase
 * @returns {Roles} The user's role
 */
export function useRole() {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(Roles.GUEST);

    useEffect(() => {
        if (user && !loading) {
            // Get role from user metadata
            const userRole = user.user_metadata?.role || Roles.USER;

            if (userRole === Roles.ADMIN) {
                setRole(Roles.ADMIN);
            } else if (userRole === Roles.AGENT) {
                setRole(Roles.AGENT);
            } else {
                setRole(Roles.USER);
            }
        } else {
            setRole(Roles.GUEST);
        }
    }, [user, loading]);

    return role;
}
