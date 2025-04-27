"use client";

import { motion } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import { useRouter } from "next/navigation";

interface EmailVerificationSuccessProps {
  email?: string;
  onResendVerification?: () => Promise<void>;
  isResending?: boolean;
}

export function EmailVerificationSuccess({
  email,
  onResendVerification,
  isResending: externalIsResending,
}: EmailVerificationSuccessProps) {
  const [internalIsResending, setInternalIsResending] = useState(false);
  const isResending =
    externalIsResending !== undefined
      ? externalIsResending
      : internalIsResending;
  const { toast } = useToast();
  const router = useRouter();

  const handleResendEmail = async () => {
    if (!onResendVerification) return;

    try {
      if (externalIsResending === undefined) {
        setInternalIsResending(true);
      }
      await onResendVerification();
      toast({
        title: "Verification email sent",
        description: "A new verification email has been sent to your inbox.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to resend verification email",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      if (externalIsResending === undefined) {
        setInternalIsResending(false);
      }
    }
  };

  const handleReturnToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full max-w-md mx-auto space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800"
    >
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
          <Check className="h-8 w-8 text-green-600 dark:text-green-500" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight">
          Account Created Successfully!
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400">
          We&apos;ve sent a verification email to{" "}
          {email ? (
            <span className="font-medium text-zinc-900 dark:text-zinc-300">
              {email}
            </span>
          ) : (
            "your email address"
          )}
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg text-sm text-amber-800 dark:text-amber-400">
          <p className="font-medium">
            Please verify your email to activate your account
          </p>
          <p className="mt-1">
            Check your inbox and spam folder for the verification link.
          </p>
        </div>
      </div>

      {onResendVerification && (
        <div className="pt-2">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Sending...
              </span>
            ) : (
              "Resend verification email"
            )}
          </Button>
        </div>
      )}

      <div className="pt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          You can now close this window or{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600 dark:text-blue-400"
            onClick={handleReturnToLogin}
          >
            return to login
          </Button>
        </p>
      </div>
    </motion.div>
  );
}
