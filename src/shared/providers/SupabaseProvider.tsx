"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/shared/utils/supabase/client";
import { useToast } from "@/shared/hooks/use-toast";

// Define the types for our context
interface SupabaseContextType {
  // Authentication
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: any }>;
  register: (
    email: string,
    password: string,
    userData: any
  ) => Promise<{ data: any; error: any }>;
  logout: () => Promise<void>;

  // User profile and roles
  userRole: string | null;
  isAdmin: boolean;
  isAgent: boolean;
  isClient: boolean;
  updateUserProfile: (profile: any) => Promise<{ data: any; error: any }>;

  // Supabase client for direct access when needed
  supabase: ReturnType<typeof createClient>;
}

// Create the context with a default value
const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

// Provider component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  // Fetch session and set up auth listener
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // Get initial session
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          setUserRole(initialSession.user.user_metadata?.role || null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear any invalid session data
        setSession(null);
        setUser(null);
        setUserRole(null);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Call the initialization
    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setUserRole(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setSession(newSession);
        setUser(newSession?.user || null);
        setUserRole(newSession?.user?.user_metadata?.role || null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, toast]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (response.error) {
        toast({
          title: "Login Failed",
          description: response.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }

      return response;
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Register function
  const register = async (email: string, password: string, userData: any) => {
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (response.error) {
        toast({
          title: "Registration Failed",
          description: response.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Your account has been created",
        });

        // Try to assign a default role if we have a user
        if (response.data?.user) {
          try {
            await supabase.rpc("add_user_profile", {
              p_user_id: response.data.user.id,
              p_role_name: userData.role || "user",
            });
          } catch (error) {
            console.warn("Unable to assign default role", error);
          }
        }
      }

      return response;
    } catch (error: any) {
      toast({
        title: "Registration Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Update user profile
  const updateUserProfile = async (profile: any) => {
    try {
      const response = await supabase.auth.updateUser({
        data: profile,
      });

      if (response.error) {
        toast({
          title: "Update Failed",
          description: response.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
        // Update local state
        setUserRole(response.data.user.user_metadata?.role || null);
      }

      return response;
    } catch (error: any) {
      toast({
        title: "Update Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  // Role-based flags for easier component rendering
  const isAdmin = userRole === "admin";
  const isAgent = userRole === "agent";
  const isClient = userRole === "user";

  // Context value
  const value: SupabaseContextType = {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    userRole,
    isAdmin,
    isAgent,
    isClient,
    updateUserProfile,
    supabase,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to use the Supabase context
export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}
