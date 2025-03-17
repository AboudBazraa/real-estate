"use client";
import { useState, useRef } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useToast } from "@/shared/hooks/use-toast";
import { LoginForm } from "@/shared/components/login-form";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
        variant: "success",
      });
      router.push(user.role === "Admin" ? "/admin" : "/agent");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
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
        <LoginForm handleLogin={handleLogin} isLoading={isLoading} />

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Dont have an account?{" "}
          <Link
            href="/auth/registration"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
