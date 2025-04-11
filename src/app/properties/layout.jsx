import { UserProvider } from "@/shared/providers/UserProvider";
import { SupabaseProvider } from "@/shared/providers/SupabaseProvider";
import { Suspense } from "react";

export default function PropertiesLayout({ children }) {
  return (
    <SupabaseProvider>
      <UserProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </UserProvider>
    </SupabaseProvider>
  );
}
