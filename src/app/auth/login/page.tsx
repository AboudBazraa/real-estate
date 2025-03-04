import { LoginForm } from "@/shared/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-6 bg-background md:px-2 md:py-3">
      <div className="flex justify-center xl:justify-between items-center w-full h-full bg-zinc-100 dark:bg-zinc-950 border-2 border-dashed rounded-2xl border-zinc-300 dark:border-zinc-900 p-0.5">
        <div className="w-70 h-full rounded-l-2xl dark:bg-slate-950 xl:block hidden"></div>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
        <div className="w-70 h-full rounded-r-2xl dark:bg-slate-950 xl:block hidden"></div>
      </div>
    </div>
  );
}
