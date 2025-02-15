"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import Link from "next/link";
import { useState, useRef } from "react";
import { useToast } from "../hooks/use-toast";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [data, setData] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneValue = phoneRef.current?.value.trim();

    if (!data) {
      if (!phoneValue) {
        toast({
          title: "Error",
          description: "Phone number is required",
          variant: "destructive",
        });
        return;
      }

      phoneValue === "123" && setData(true);
      phoneRef.current!.value = "";
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

      if (password.length < 8) {
        toast({
          title: "Error",
          description: "Password must be at least 8 characters",
          variant: "destructive",
        });
        return;
      }

      alert("Phone and Password submitted successfully!");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </Link>
            <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/registration"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-6 ease-in-out">
            <Logininput
              data={data}
              setData={setData}
              phoneRef={phoneRef}
              passwordRef={passwordRef}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary dark:text-zinc-600">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

const Logininput = ({
  data,
  setData,
  phoneRef,
  passwordRef,
  handleSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 transition-all duration-300">
        <div className="relative">
          <Label htmlFor={data ? "password" : "phone"}>
            {data ? "Password" : "Phone Number"}
          </Label>
          <div className="relative">
            <Input
              id={data ? "password" : "phone"}
              type={data ? (showPassword ? "text" : "password") : "tel"}
              ref={data ? passwordRef : phoneRef}
              placeholder={data ? "********" : "+1 (123) 456-7890"}
              required
              className="transition-all duration-300 opacity-70 ease-in-out "
            />
            {data && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.558 7.36 4.22 12.001 4.22c4.639 0 8.578 3.338 8.578 7.755A9.965 9.965 0 0112 19.803c-4.64 0-8.578-3.338-8.578-7.755zM12 14c1.668 0 2.988-1.32 2.988-2.988S13.668 8.012 12 8.012s-3 1.32-3 2.988 1.32 3 3 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.936 19.5A10.477 10.477 0 003.98 8.223zM7.504 8.223A2.287 2.287 0 015.821 7.63H3.98A10.477 10.477 0 001.936 19.5A10.477 10.477 0 003.98 8.223zM12.001 2.223A10.475 10.475 0 0120.064 8.223h-2.01a8.463 8.463 0 00-6.043 0h-2.01A10.477 10.477 0 0112.001 2.223zM14.67 19.5a10.473 10.473 0 01-8.035-3.977h1.99a8.473 8.473 0 006.043 0h2.01A10.477 10.477 0 0114.67 19.5z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          type="submit"
          className="w-full rounded-xl text-white font-bold py-2 px-4 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg active:shadow"
        >
          {data ? "Login" : "Next"}
        </Button>
      </div>
    </>
  );
};
