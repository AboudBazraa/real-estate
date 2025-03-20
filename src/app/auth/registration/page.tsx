"use client";
import { useState } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import { RegisterForm } from "@/shared/components/register-form";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      toast({
        title: "Registration successful",
        description: "Welcome to Almukalla!",
        variant: "success",
      });
      router.push("/agent");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-900 dark:to-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl"
      >

        <RegisterForm handleRegister={handleRegister} isLoading={isLoading} />

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
