"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/shared/utils/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get verification token from URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");

        if (!token || (type !== "email_change" && type !== "signup")) {
          setStatus("error");
          setMessage(
            "Invalid verification link. Please try registering again."
          );
          return;
        }

        // Create Supabase client
        const supabase = createClient();

        // Verify the token
        if (type === "signup") {
          // Handle signup confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email",
          });

          if (error) {
            console.error("Verification error:", error);
            setStatus("error");
            setMessage(
              error.message ||
                "Failed to verify email. The link may have expired."
            );
          } else {
            setStatus("success");
            setMessage(
              "Your email has been verified! You can now login to your account."
            );

            // Redirect to login page after a delay
            setTimeout(() => {
              router.push("/auth/login");
            }, 3000);
          }
        } else if (type === "email_change") {
          // Handle email change confirmation
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "email_change",
          });

          if (error) {
            setStatus("error");
            setMessage(error.message || "Failed to verify new email.");
          } else {
            setStatus("success");
            setMessage("Your new email has been verified!");
          }
        }
      } catch (error) {
        console.error("Verification process error:", error);
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verifying Your Email
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>
            <Link
              href="/auth/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{message}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/auth/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Go to Login
              </Link>
              <Link
                href="/auth/registration"
                className="inline-block bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-medium py-2 px-6 rounded-md transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
