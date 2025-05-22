import { useState, useEffect } from "react";
import { createClient } from "@/shared/utils/supabase/client";
import { authService } from "../services/auth";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Initial user check - with safer handling
    const checkUser = async () => {
      try {
        const userData = await authService.getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    login: authService.login,
    register: authService.register,
    logout: authService.logout,
    updatePassword: authService.updatePassword,
    resetPassword: authService.resetPassword,
    resendVerificationEmail: authService.resendVerificationEmail,
    signInWithGoogle: authService.signInWithGoogle,
  };
}
