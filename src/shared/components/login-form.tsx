"use client";
import { useState, useRef } from "react";
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
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { motion } from "framer-motion";

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
  const [data, setData] = useState(false);
  const [username, setUsername] = useState("");
  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) {
      const username = userNameRef.current?.value.trim();
      if (!username) {
        toast({
          title: "Error",
          description: "Username is required",
          variant: "destructive",
        });
        return;
      }
      setUsername(username);
      setData(true);
    } else {
      const password = passwordRef.current?.value.trim();
      if (!password) {
        toast({
          title: "Error",
          description: "Password is required",
          variant: "destructive",
        });
        return;
      }
      await handleLogin(username, password);
    }
  };

  const inputVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      y: -10,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col space-y-6 transition-all duration-300 ease-in-out">
            <LoginInput
              data={data}
              setData={setData}
              userNameRef={userNameRef}
              passwordRef={passwordRef}
              handleSubmit={handleSubmit}
              onForgotPassword={onForgotPassword}
              isLoading={isLoading}
            />
          </div>
        </div>
      </form>
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
    </div>
  );
}

const LoginInput = ({
  data,
  setData,
  userNameRef,
  passwordRef,
  handleSubmit,
  onForgotPassword,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const username = userNameRef.current?.value || "";

  return (
    <motion.div
      className="flex flex-col gap-6 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {!data ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-sm font-medium flex items-center gap-1.5"
            >
              <AtSign className="h-4 w-4 text-zinc-500" />
              <span>Email or Username</span>
            </Label>
            <div className="relative group">
              <Input
                id="username"
                type="text"
                ref={userNameRef}
                placeholder="Enter your email or username"
                required
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="h-11 px-4 rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:shadow flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1">
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="space-y-1.5">
            <div className="flex justify-between items-center mb-1">
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
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors flex items-center gap-1"
                >
                  <span>Forgot password?</span>
                </button>
              )}
            </div>

            <div className="relative group">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                placeholder="Enter your password"
                required
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="h-11 pl-4 pr-12 rounded-xl bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
              <div className="absolute inset-0 rounded-xl border border-blue-500 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"></div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-zinc-600 dark:text-zinc-400"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => setData(false)}
                className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
              >
                Not {username}?
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:shadow flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                <span>Logging in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>Login</span>
              </div>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
