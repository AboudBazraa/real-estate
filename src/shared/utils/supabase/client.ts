import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_CONFIG } from "@/shared/config/supabase";

export function createClient() {
  // Check if environment variables are defined
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Using mock client.");
    // Return a mock client that doesn't make actual API calls
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: null,
        }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: null,
        }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        verifyOtp: async () => ({
          data: { user: null, session: null },
          error: null,
        }),
        resend: async () => ({ data: {}, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            data: null,
            error: null,
          }),
          data: null,
          error: null,
        }),
      }),
      rpc: async () => ({ data: null, error: null }),
    } as any;
  }

  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: "supabase.auth.token",
      storage: {
        getItem: (key) => {
          if (typeof window !== "undefined") {
            return window.localStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(key);
          }
        },
      },
    },
  });
}
