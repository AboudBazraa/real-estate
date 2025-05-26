"use client";

import { useAuth } from "@/app/auth/hooks/useAuth";
import { Navigate } from "next/navigation";
import LoginForm from "@/app/auth/components/LoginForm";
// import { RegisterForm } from "@/shared/components/register-form";

export default function AuthContent() {
  const { user, loading, login, register } = useAuth();

  if (user && !loading) {
    return <Navigate href="/dashboard" />;
  }

  return (
    <div className="auth-container">
      <h1>Real Estate Authentication</h1>
      {!user && (
        <div className="auth-forms">
          <LoginForm login={login} />
          {/* <RegisterForm register={register} /> */}
        </div>
      )}
    </div>
  );
}
