import { useState } from "react";
import { createClient } from "@/shared/utils/supabase/client";
import { useToast } from "@/shared/hooks/use-toast";
import Roles from "../types/roles";

const supabase = createClient();

/**
 * Hook for updating a user's role in Supabase
 * @returns Methods and state for updating user roles
 */
export function useUpdateUserRole() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  /**
   * Update the role of the current user
   * @param role The new role to assign
   * @returns The updated user if successful
   */
  const updateCurrentUserRole = async (role: Roles) => {
    if (!Object.values(Roles).includes(role)) {
      toast({
        title: "Invalid role",
        description: `Role must be one of: ${Object.values(Roles).join(", ")}`,
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsUpdating(true);

      // Update the user metadata with the new role
      const { data, error } = await supabase.auth.updateUser({
        data: { role },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Role updated",
        description: `Your role has been updated to ${role}`,
        variant: "success",
      });

      return data.user;
    } catch (error: any) {
      toast({
        title: "Failed to update role",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Update the role of any user (admin only)
   * @param userId The ID of the user to update
   * @param role The new role to assign
   * @returns True if successful, false otherwise
   */
  const updateUserRole = async (userId: string, role: Roles) => {
    if (!Object.values(Roles).includes(role)) {
      toast({
        title: "Invalid role",
        description: `Role must be one of: ${Object.values(Roles).join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsUpdating(true);

      // Call an RPC function to update another user's role (requires admin privileges)
      const { error } = await supabase.rpc("update_user_role", {
        p_user_id: userId,
        p_role_name: role,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Role updated",
        description: `User role has been updated to ${role}`,
        variant: "success",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Failed to update role",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateCurrentUserRole,
    updateUserRole,
    isUpdating,
  };
}
