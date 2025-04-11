"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import {
  GalleryVerticalEnd,
  AlertCircle,
  Check,
  Lock,
  KeyRound,
  ArrowLeft,
  EyeIcon,
  EyeOffIcon,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/shared/utils/supabase/client";

export default function ResetPasswordPage() {
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validations, setValidations] = useState({
    passwordLength: false,
    passwordNumber: false,
    passwordSpecial: false,
    passwordsMatch: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // No active session, redirect to login
        toast({
          title: "Missing authentication session",
          description: "Please request a password reset from the login page",
          variant: "destructive",
        });
        router.push("/auth/login");
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    // Calculate password strength (0-100)
    let strength = 0;
    if (password.length > 0) {
      // Base points for having a password
      strength += 10;

      // Length points (up to 30)
      strength += Math.min(30, password.length * 2);

      // Complexity points
      if (/[A-Z]/.test(password)) strength += 15; // Uppercase
      if (/[0-9]/.test(password)) strength += 15; // Numbers
      if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special chars
      if (/(.)\1\1/.test(password)) strength -= 10; // Repeated characters penalty

      // Min/max cap
      strength = Math.max(10, Math.min(100, strength));
    }

    setPasswordStrength(strength);

    // Validate password as user types
    setValidations({
      passwordLength: password.length >= 8,
      passwordNumber: /[0-9]/.test(password),
      passwordSpecial: /[^A-Za-z0-9]/.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
    });
  }, [password, confirmPassword]);

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!validations.passwordLength || !validations.passwordNumber) {
      setError("Password must be at least 8 characters and contain a number");
      return;
    }

    if (!validations.passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      // Show success
      setIsComplete(true);
      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password",
        variant: "success",
      });

      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      setError(error.message || "Failed to reset password");
      toast({
        title: "Error resetting password",
        description: error.message || "Please try again or request a new link",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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
    <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950 transition-colors duration-700 ">
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 dark:bg-indigo-900 -z-10 opacity-5 blur-3xl rounded-full transform -translate-y-1/2 scale-x-150"></div>
      {/* <div className="absolute bottom-0 right-0 w-full h-64 bg-indigo-600 dark:bg-blue-900 -z-10 opacity-5 blur-3xl rounded-full transform translate-y-1/2 scale-x-150"></div> */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md space-y-4 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm backdrop-filter relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-30 blur-xl"></div>

        <motion.div variants={itemVariants} className="relative z-10">
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-0 left-0"
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-1 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
          </motion.div>

          <div className="flex flex-col items-center gap-2 mb-8 mt-2">
            <motion.div
              className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3 shadow-sm"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
              ) : (
                <KeyRound className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              )}
            </motion.div>

            <h1 className="text-2xl font-bold text-center">
              {isComplete ? "Password Updated" : "Reset Your Password"}
            </h1>
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
              {isComplete
                ? "Your password has been changed successfully!"
                : "Create a new secure password for your account"}
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.div
              key="success"
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-8"
            >
              <motion.div
                className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">You&apos;re All Set!</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Your password has been updated successfully.
                </p>
              </div>

              <div className="w-full space-y-2">
                <motion.div
                  className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full w-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </motion.div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Redirecting in 3 seconds...</span>
                  <span className="flex items-center gap-1">
                    <span>Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => router.push("/auth/login")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Go to login now
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.form
              variants={itemVariants}
              onSubmit={handlePasswordReset}
              className="space-y-6 relative z-10"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex items-start gap-2 border border-red-100 dark:border-red-900/30"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="space-y-5">
                <motion.div variants={itemVariants} className="space-y-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Lock className="h-3.5 w-3.5 text-blue-600" />
                    <span>New Password</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 pr-10 transition-all duration-200"
                      placeholder="Enter your new password"
                      disabled={isProcessing}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
                  </div>

                  {password.length > 0 && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-600 dark:text-zinc-400">
                            Password strength:
                          </span>
                          <span
                            className={`font-medium ${
                              passwordStrength < 30
                                ? "text-red-600 dark:text-red-400"
                                : passwordStrength < 60
                                ? "text-yellow-600 dark:text-yellow-400"
                                : passwordStrength < 80
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-green-600 dark:text-green-400"
                            }`}
                          >
                            {getStrengthText()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${getStrengthColor()}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mt-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              validations.passwordLength
                                ? "bg-green-500"
                                : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          ></div>
                          <span
                            className={
                              validations.passwordLength
                                ? "text-green-600 dark:text-green-400"
                                : "text-zinc-600 dark:text-zinc-400"
                            }
                          >
                            At least 8 characters
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              validations.passwordNumber
                                ? "bg-green-500"
                                : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          ></div>
                          <span
                            className={
                              validations.passwordNumber
                                ? "text-green-600 dark:text-green-400"
                                : "text-zinc-600 dark:text-zinc-400"
                            }
                          >
                            Contains a number
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              validations.passwordSpecial
                                ? "bg-green-500"
                                : "bg-zinc-300 dark:bg-zinc-600"
                            }`}
                          ></div>
                          <span
                            className={
                              validations.passwordSpecial
                                ? "text-green-600 dark:text-green-400"
                                : "text-zinc-600 dark:text-zinc-400"
                            }
                          >
                            Special character
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Check className="h-3.5 w-3.5 text-blue-600" />
                    <span>Confirm Password</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 pr-10 transition-all duration-200 ${
                        confirmPassword && !validations.passwordsMatch
                          ? "border-red-300 dark:border-red-700"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      placeholder="Confirm your password"
                      disabled={isProcessing}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>

                    <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>

                    {confirmPassword && validations.passwordsMatch && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      </div>
                    )}
                  </div>

                  {confirmPassword && !validations.passwordsMatch && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-red-500 text-xs flex items-center gap-1 mt-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      Passwords don&apos;t match
                    </motion.p>
                  )}
                </motion.div>
              </div>

              <motion.button
                variants={itemVariants}
                whileHover={{
                  y: -2,
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{
                  y: 0,
                  boxShadow: "0 0px 0px rgba(59, 130, 246, 0)",
                }}
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-medium text-sm shadow-md disabled:opacity-70 disabled:pointer-events-none"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Updating password...</span>
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>

              <motion.div variants={itemVariants} className="text-center pt-2">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Need help?{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Contact Support
                  </a>
                </p>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
