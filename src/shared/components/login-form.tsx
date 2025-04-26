"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import {
  GalleryVerticalEnd,
  AlertCircle,
  EyeIcon,
  EyeOffIcon,
  ChevronRight,
  AtSign,
  LockIcon,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface LoginFormProps {
  className?: string;
  handleLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  onForgotPassword?: () => void;
}

export function LoginForm({
  className,
  handleLogin,
  isLoading,
  onForgotPassword,
  ...props
}: LoginFormProps) {
  const [step, setStep] = useState<"username" | "password">("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateUsername = (value: string) => {
    if (!value.trim()) {
      return "Email or username is required";
    }
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return "Password is required";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usernameValue = userNameRef.current?.value.trim() || "";
    const error = validateUsername(usernameValue);

    if (error) {
      setFormErrors((prev) => ({ ...prev, username: error }));
      userNameRef.current?.focus();
      return;
    }

    setUsername(usernameValue);
    setFormErrors((prev) => ({ ...prev, username: "" }));
    setStep("password");

    // Focus password field after transition
    setTimeout(() => {
      passwordRef.current?.focus();
    }, 300);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordValue = passwordRef.current?.value.trim() || "";
    const error = validatePassword(passwordValue);

    if (error) {
      setFormErrors((prev) => ({ ...prev, password: error }));
      passwordRef.current?.focus();
      return;
    }

    setPassword(passwordValue);
    setFormErrors((prev) => ({ ...prev, password: "" }));

    try {
      await handleLogin(username, passwordValue);

      // Store in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedUser", username);
      } else {
        localStorage.removeItem("rememberedUser");
      }
    } catch (error) {
      setLoginAttempts((prev) => prev + 1);

      // After 3 failed attempts, suggest password reset
      if (loginAttempts >= 2) {
        toast({
          title: "Multiple failed login attempts",
          description:
            "Having trouble logging in? Try resetting your password.",
          action: onForgotPassword ? (
            <Button variant="outline" size="sm" onClick={onForgotPassword}>
              Reset Password
            </Button>
          ) : undefined,
          duration: 5000,
        });
      }
    }
  };

  // Check for remembered user on component mount
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      setUsername(rememberedUser);
      if (userNameRef.current) {
        userNameRef.current.value = rememberedUser;
      }
      setRememberMe(true);
    }
  }, []);

  const goBackToUsername = () => {
    setStep("username");
    setTimeout(() => {
      userNameRef.current?.focus();
    }, 300);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <AnimatePresence mode="wait">
        {step === "username" ? (
          <motion.form
            key="username-form"
            onSubmit={handleUsernameSubmit}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium flex items-center gap-1.5"
                  >
                    <AtSign className="h-4 w-4 text-zinc-500" />
                    <span>Email or Username</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      ref={userNameRef}
                      placeholder="Enter your email or username"
                      defaultValue={username}
                      onChange={(e) => {
                        const error = validateUsername(e.target.value);
                        setFormErrors((prev) => ({ ...prev, username: error }));
                      }}
                      className={cn(
                        "h-11 px-4 rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300",
                        formErrors.username &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    {username && !formErrors.username && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {formErrors.username && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.username}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !!formErrors.username}
                  className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:shadow flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <span>Continue</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="password-form"
            onSubmit={handlePasswordSubmit}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={formVariants}
          >
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 text-sm text-zinc-500">
                  <button
                    type="button"
                    onClick={goBackToUsername}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <span className="flex-1 text-center font-medium">
                    {username}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium flex items-center gap-1.5"
                    >
                      <LockIcon className="h-4 w-4 text-zinc-500" />
                      <span>Password</span>
                    </Label>
                    {onForgotPassword && (
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      placeholder="Enter your password"
                      onChange={(e) => {
                        const error = validatePassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, password: error }));
                      }}
                      className={cn(
                        "h-11 px-4 pr-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300",
                        formErrors.password &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1.5">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-zinc-600 dark:text-zinc-400"
                  >
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !!formErrors.password}
                  className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:shadow"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary dark:text-zinc-600">
        By clicking continue, you agree to our{" "}
        <a href="#" className="hover:text-blue-600 transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="hover:text-blue-600 transition-colors">
          Privacy Policy
        </a>
        .
      </div>

      {/* <div className="text-center">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Dont have an account?{" "}
          <Link
            href="/auth/registration"
            className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
          >
            Sign up
          </Link>
        </span>
      </div> */}
    </div>
  );
}
