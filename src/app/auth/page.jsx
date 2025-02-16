"use client";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { Navigate } from "next/navigation";
import LoginForm from "@/app/auth/components/LoginForm";
// import { RegisterForm } from "@/shared/components/register-form";

export default function AuthPage() {
  const { user, isLoading, error, login, register } = useAuth();

  if (user && !isLoading) {
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
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
