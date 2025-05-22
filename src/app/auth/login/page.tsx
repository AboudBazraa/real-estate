"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouteProtection } from "@/app/auth/hooks/useRouteProtection";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import { LoginForm } from "@/shared/components/login-form";
import { GalleryVerticalEnd, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login, loading, resetPassword, signInWithGoogle } = useAuth();
  const { isLoading } = useRouteProtection({ requireAuth: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Check if user was redirected from a protected route
  const redirectTo = searchParams.get("redirectTo");

  useEffect(() => {
    // Show toast notification if user was redirected from a protected route
    if (redirectTo) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to access that page.",
        variant: "destructive",
      });
    }
  }, [redirectTo, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsSubmitting(true);
      const { user, session } = await login(username, password);

      // Success animation before redirecting
      toast({
        title: "Login successful",
        description: `Welcome back!`,
        variant: "success",
      });

      // Determine where to redirect the user
      // First check if there's a redirectTo param from a protected route
      if (redirectTo) {
        setTimeout(() => {
          router.push(redirectTo);
        }, 800);
      } else {
        // Otherwise, redirect based on user role
        const userRole = user?.user_metadata?.role || "user";
        setTimeout(() => {
          router.push(
            userRole.toLowerCase() === "admin"
              ? "/admin"
              : userRole.toLowerCase() === "agent"
              ? "/agent"
              : "/search"
          );
        }, 800); // Increased delay for better UX
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Set up the redirect URL
      const redirectUrl = `${window.location.origin}/auth/reset-password`;

      // Call Supabase's reset password function
      await resetPassword(forgotEmail, redirectUrl);

      setResetEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 transition-colors duration-700 overflow-y-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 dark:bg-indigo-900 -z-10 opacity-5 blur-3xl rounded-full transform -translate-y-1/2 scale-x-150"></div>

      <AnimatePresence mode="wait">
        {showForgotPassword ? (
          <motion.div
            key="forgot-password"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm backdrop-filter"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-start mb-6">
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="inline-flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                  aria-label="Back to login"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-bold">Reset Password</h1>
                </div>
                <div className="w-7"></div> {/* Spacer for alignment */}
              </div>

              <motion.div variants={itemVariants}>
                {resetEmailSent ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
                      <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-center">
                      Check Your Email
                    </h2>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 max-w-xs">
                      We&apos;ve sent a password reset link to{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-300">
                        {forgotEmail}
                      </span>
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-500 text-center">
                      Didn&apos;t receive the email? Check your spam folder or
                      request another link.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmailSent(false);
                      }}
                      className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      Return to login
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                      Enter your email address and we&apos;ll send you a link to
                      reset your password.
                    </p>
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium flex items-center justify-between"
                        >
                          <span>Email Address</span>
                        </label>
                        <div className="relative group">
                          <input
                            id="email"
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 transition-all duration-200"
                            placeholder="email@example.com"
                            disabled={isSubmitting}
                          />
                          <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{
                          y: -2,
                          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                        }}
                        whileTap={{
                          y: 0,
                          boxShadow: "0 0px 0px rgba(59, 130, 246, 0)",
                        }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm shadow-md disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Reset Link</span>
                        )}
                      </motion.button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm backdrop-filter"
          >
            <motion.div variants={itemVariants}>
              <div className="flex flex-col items-center mb-6">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                  <GalleryVerticalEnd className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-center text-sm mt-1">
                  Sign in to your account to continue
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <LoginForm
                handleLogin={handleLogin}
                isLoading={isSubmitting || loading}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-300 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                  whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0)" }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white p-2.5 text-sm font-medium hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 transition-all duration-200"
                  type="button"
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      await signInWithGoogle();
                      // Note: No need for success toast here as the page will redirect to the callback URL
                    } catch (error: any) {
                      toast({
                        title: "Google login failed",
                        description: error.message || "Could not sign in with Google",
                        variant: "destructive",
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span>{isSubmitting ? "Connecting..." : "Google"}</span>
                </motion.button>
                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                  whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0)" }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white p-2.5 text-sm font-medium hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 transition-all duration-200"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                    <path d="M16.318 13.715c.607-.593 1.119-1.356 1.498-2.26.151-.363.225-.648.235-.792h-4.9v3.05h3.167Z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm5.176 6.302h-1.69l-1.843 3h-2.718v-3h-2v9h2v-3h5.237a7.504 7.504 0 0 1-5.962 3h-8.334A7.994 7.994 0 0 0 12 20a7.994 7.994 0 0 0 7.176-4.537l.016-.01A7.548 7.548 0 0 0 20 12a7.497 7.497 0 0 0-2.824-5.698Z" />
                  </svg>
                  <span>Facebook</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/registration"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center gap-1 hover:gap-2 transition-all duration-200"
                >
                  <span>Register here</span>
                  <span className="text-xs">→</span>
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
