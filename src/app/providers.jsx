"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SupabaseProvider } from "@/shared/providers/SupabaseProvider";
import { UserProvider } from "@/shared/providers/UserProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <UserProvider>
          <ThemeProvider defaultTheme="system" storageKey="real-estate-theme">
            {children}
          </ThemeProvider>
        </UserProvider>
      </SupabaseProvider>
    </QueryClientProvider>
  );
}
