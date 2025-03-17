"use client";
import { useState } from "react";
import { useAuth } from "@/app/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useRole } from "@/app/auth/hooks/useRole";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading , error } = useAuth();
  const router = useRouter();
  const role = useRole();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push(`${role === "ADMIN" ? "/admin" : "/agent"}`)
    } catch (error) {
      // Handle error - potentially display a more user-friendly message
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <p>
        Don&apos;t have an account?{" "}
        <button
          type="button" // Prevent form submission
          onClick={() => router.push("/auth/registration")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Register here
        </button>
      </p>
    </form>
  );
}