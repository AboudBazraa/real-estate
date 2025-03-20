"use client";

import React from "react";
import { SupabaseProvider } from "@/shared/providers/SupabaseProvider";
import { UserProvider } from "@/shared/providers/UserProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <UserProvider>{children}</UserProvider>
    </SupabaseProvider>
  );
}
