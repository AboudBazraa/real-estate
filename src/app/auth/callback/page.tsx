"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/client";
import { useToast } from "@/shared/hooks/use-toast";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data?.session) {
          // Get user data
          const { data: userData } = await supabase.auth.getUser();
          const user = userData.user;

          // Show success message
          toast({
            title: "Login successful",
            description: `Welcome${user?.user_metadata?.full_name ? ` ${user.user_metadata.full_name}` : ""}!`,
            variant: "success",
          });

          // Determine where to redirect the user based on role
          const userRole = user?.user_metadata?.role || "user";
          setTimeout(() => {
            router.push(
              userRole.toLowerCase() === "admin"
                ? "/admin"
                : userRole.toLowerCase() === "agent"
                ? "/agent"
                : "/search"
            );
          }, 800); // Short delay for better UX
        } else {
          // No session found, redirect to login
          router.push("/auth/login");
        }
      } catch (error: any) {
        console.error("Error in auth callback:", error);
        setError(error.message || "Authentication failed");
        toast({
          title: "Authentication failed",
          description: error.message || "There was a problem signing you in",
          variant: "destructive",
        });
        
        // Redirect to login after error
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [router, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            {error ? "Authentication Error" : "Completing Sign In..."}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {error || "Please wait while we authenticate your account"}
          </p>
          {!error && (
            <div className="flex justify-center mt-6">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}