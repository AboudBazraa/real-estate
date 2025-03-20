import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

// Helper to add retry logic for network failures
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      if (retries >= maxRetries || !isRetryableError(error)) {
        throw error;
      }
      console.log(
        `Retrying operation after ${delay}ms (${retries + 1}/${maxRetries})...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries++;
      // Exponential backoff
      delay *= 2;
    }
  }
}

// Determines if an error is worth retrying
function isRetryableError(error: any): boolean {
  // Network errors and timeout errors are retryable
  return (
    error.name === "AuthRetryableFetchError" ||
    error.name === "FetchError" ||
    error.message?.includes("network") ||
    error.message?.includes("timeout") ||
    error.message?.includes("failed to fetch")
  );
}

export function createClient() {
  // Create a supabase client on the browser with project's credentials
  console.log("Creating Supabase browser client");

  try {
    // Make sure environment variables are available and valid
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase credentials are missing!");
      throw new Error(
        "Supabase environment variables are not configured properly"
      );
    }

    const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => {
            if (typeof window !== "undefined") {
              try {
                const item = window.localStorage.getItem(key);
                return item;
              } catch (error) {
                console.error(`Error getting auth item ${key}:`, error);
                return null;
              }
            }
            return null;
          },
          setItem: (key, value) => {
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(key, value);
              } catch (error) {
                console.error(`Error setting auth item ${key}:`, error);
              }
            }
          },
          removeItem: (key) => {
            if (typeof window !== "undefined") {
              try {
                window.localStorage.removeItem(key);
              } catch (error) {
                console.error(`Error removing auth item ${key}:`, error);
              }
            }
          },
        },
        debug: process.env.NODE_ENV === "development",
        flowType: "pkce", // Use PKCE flow for more secure auth
      },
      global: {
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
          // Use the retry logic for fetch operations
          return withRetry(() => fetch(input, init));
        },
      },
    });

    console.log("Supabase browser client created successfully");
    return client;
  } catch (error) {
    console.error("Error creating Supabase browser client:", error);
    // Return a dummy client that won't break the app completely
    return createFallbackClient();
  }
}

// Create a fallback client that won't throw errors but won't work either
function createFallbackClient() {
  console.warn("Using fallback Supabase client - authentication will not work");

  // This is a minimal implementation that doesn't throw errors
  // but doesn't actually connect to Supabase either
  return {
    auth: {
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () =>
        Promise.resolve({
          data: null,
          error: new Error("Using fallback client"),
        }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => ({
      select: () => Promise.resolve({ data: null, error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  };
}

// Add a utility function to refresh the auth session
export async function refreshSession(supabase: SupabaseClient) {
  try {
    console.log("Attempting to refresh auth session");
    const result = await withRetry(() => supabase.auth.refreshSession());

    // Properly type the result
    const { data, error } = result;

    if (error) {
      console.error("Error refreshing session:", error);
      if (error.message === "Auth session missing!") {
        console.log("No session found, user may need to log in");
        return { isAuthenticated: false, error };
      }
      return { isAuthenticated: false, error };
    }

    if (data.session) {
      console.log("Session refreshed successfully");
      return { isAuthenticated: true, session: data.session, user: data.user };
    } else {
      console.log("No session after refresh, user is not authenticated");
      return { isAuthenticated: false };
    }
  } catch (e) {
    console.error("Exception while refreshing session:", e);
    return { isAuthenticated: false, error: e };
  }
}
