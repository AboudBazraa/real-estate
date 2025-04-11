"use client";
import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { GalleryVerticalEnd, AlertCircle, Check } from "lucide-react";
import { motion } from "framer-motion";

interface RegisterFormProps {
  className?: string;
  handleRegister: (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({
  className,
  handleRegister,
  isLoading,
  ...props
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [focused, setFocused] = useState<string | null>(null);
  const [validations, setValidations] = useState({
    passwordLength: false,
    passwordNumber: false,
    passwordsMatch: false,
    validEmail: false,
  });

  useEffect(() => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidations((prev) => ({
      ...prev,
      validEmail: emailRegex.test(formData.email),
    }));

    // Password validations
    setValidations((prev) => ({
      ...prev,
      passwordLength: formData.password.length >= 8,
      passwordNumber: /\d/.test(formData.password),
      passwordsMatch:
        formData.password === formData.confirmPassword &&
        formData.password !== "",
    }));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors = {
      username: !formData.username ? "Username is required" : "",
      email: !validations.validEmail ? "Please enter a valid email" : "",
      password:
        !validations.passwordLength || !validations.passwordNumber
          ? "Password must be at least 8 characters and contain a number"
          : "",
      confirmPassword: !validations.passwordsMatch
        ? "Passwords don't match"
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    await handleRegister(formData);
  };

  return (
    <motion.div
      className={cn("flex flex-col gap-6", className)}
      {...props}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* <div className="flex flex-col items-center gap-2">
        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
        </Link>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-slate-500 dark:text-slate-400">
          Enter your details to create your account
        </p>
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          className="grid gap-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Label htmlFor="username" className="flex justify-between">
            <span>Username</span>
            {errors.username && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.username}
              </span>
            )}
          </Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            onFocus={() => setFocused("username")}
            onBlur={() => setFocused(null)}
            placeholder="johndoe"
            required
            className={cn(
              "transition-all duration-200",
              focused === "username" && "border-blue-400 ring-1 ring-blue-200",
              errors.username && "border-red-300 bg-red-50"
            )}
          />
        </motion.div>

        <motion.div
          className="grid gap-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="email" className="flex justify-between">
            <span>Email</span>
            {errors.email && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </span>
            )}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="john@example.com"
            required
            className={cn(
              "transition-all duration-200",
              focused === "email" && "border-blue-400 ring-1 ring-blue-200",
              errors.email && "border-red-300 bg-red-50"
            )}
          />
          {formData.email && (
            <div className="text-xs flex items-center gap-1 mt-1">
              <span
                className={
                  validations.validEmail ? "text-green-500" : "text-zinc-400"
                }
              >
                {validations.validEmail ? (
                  <Check className="h-3 w-3 inline" />
                ) : (
                  "•"
                )}
              </span>
              <span
                className={
                  validations.validEmail ? "text-green-600" : "text-zinc-500"
                }
              >
                Valid email format
              </span>
        </div>
          )}
        </motion.div>

        <motion.div
          className="grid gap-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="password" className="flex justify-between">
            <span>Password</span>
            {errors.password && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password}
              </span>
            )}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onFocus={() => setFocused("password")}
            onBlur={() => setFocused(null)}
            placeholder="********"
            required
            className={cn(
              "transition-all duration-200",
              focused === "password" && "border-blue-400 ring-1 ring-blue-200",
              errors.password && "border-red-300 bg-red-50"
            )}
          />
          {formData.password && (
            <div className="grid grid-cols-2 gap-1 text-xs mt-1">
              <div className="flex items-center gap-1">
                <span
                  className={
                    validations.passwordLength
                      ? "text-green-500"
                      : "text-zinc-400"
                  }
                >
                  {validations.passwordLength ? (
                    <Check className="h-3 w-3 inline" />
                  ) : (
                    "•"
                  )}
                </span>
                <span
                  className={
                    validations.passwordLength
                      ? "text-green-600"
                      : "text-zinc-500"
                  }
                >
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={
                    validations.passwordNumber
                      ? "text-green-500"
                      : "text-zinc-400"
                  }
                >
                  {validations.passwordNumber ? (
                    <Check className="h-3 w-3 inline" />
                  ) : (
                    "•"
                  )}
                </span>
                <span
                  className={
                    validations.passwordNumber
                      ? "text-green-600"
                      : "text-zinc-500"
                  }
                >
                  Contains a number
                </span>
              </div>
        </div>
          )}
        </motion.div>

        <motion.div
          className="grid gap-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Label htmlFor="confirmPassword" className="flex justify-between">
            <span>Confirm Password</span>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.confirmPassword}
              </span>
            )}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            onFocus={() => setFocused("confirmPassword")}
            onBlur={() => setFocused(null)}
            placeholder="********"
            required
            className={cn(
              "transition-all duration-200",
              focused === "confirmPassword" &&
                "border-blue-400 ring-1 ring-blue-200",
              errors.confirmPassword && "border-red-300 bg-red-50"
            )}
          />
          {formData.confirmPassword && (
            <div className="flex items-center gap-1 text-xs mt-1">
              <span
                className={
                  validations.passwordsMatch
                    ? "text-green-500"
                    : "text-zinc-400"
                }
              >
                {validations.passwordsMatch ? (
                  <Check className="h-3 w-3 inline" />
                ) : (
                  "•"
                )}
              </span>
              <span
                className={
                  validations.passwordsMatch
                    ? "text-green-600"
                    : "text-zinc-500"
                }
              >
                Passwords match
              </span>
        </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            className="w-full h-11 rounded-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
        </Button>
        </motion.div>
      </form>

      {/* <motion.div
        className="text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
        >
          Sign in
        </Link>
      </motion.div> */}
    </motion.div>
  );
}
