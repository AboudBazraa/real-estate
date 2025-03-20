"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSupabase } from "./SupabaseProvider";

interface UserContextType {
  user: any;
  isLoading: boolean;
  name: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, session } = useSupabase();

  // Get user's name from metadata or use email as fallback
  const name =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    null;

  const value = {
    user,
    isLoading,
    name,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
