import { GalleryVerticalEnd } from "lucide-react";

import { RegisterForm } from "@/shared/components/register-form";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-slate-100 lg:block dark:bg-slate-800">
        {/* <Image
          src="/images/login.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
