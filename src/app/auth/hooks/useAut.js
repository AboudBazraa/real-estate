/* "use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/shared/hooks/useApi";
import Roles from "@/app/auth/types/roles";

interface AuthState {
  user: {
    id: string;
    username: string;
    role: string;
    avatar?: string;
  } | null;
  isLoading: boolean;
  error: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginDto {
  Username: string;
  Password: string;
}

interface RegisterDto {
  Username: string;
  Email: string;
  Password: string;
}

interface LoginResponse {
  token: string;
}

interface UserData {
  id: string;
  username: string;
  role: string;
  avatar?: string; // Make avatar optional
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: "",
  });
  const router = useRouter();

  const loginMutation = useApiMutation(
    ["auth", "login"],
    { url: "/User/login" },
    "POST"
  );
  const registerMutation = useApiMutation(
    ["auth", "register"],
    { url: "/User/Create" },
    "POST"
  );

  const decodeToken = (token: string): UserData | null => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      // Get the username from the name claim
      const username =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      // Get the roles array and take the first role
      const roles =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const role = Array.isArray(roles) ? roles[0] : roles;

      return {
        id: username, // Using username as ID since we don't have a separate ID claim
        username: username,
        role: role,
        avatar: "/default-avatar.png", // Provide a default avatar
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };

  const login = async (username: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      const loginData = {
        Username: username.trim(),
        Password: password.trim(),
      };

      const response = await loginMutation.mutateAsync(loginData);

      if (!response.token) {
        throw new Error("No token received from server");
      }

      const token = response.token;
      const userData = decodeToken(token);

      if (!userData) {
        throw new Error("Invalid token received");
      }

      localStorage.setItem("authToken", token);
      setState((prev) => ({
        ...prev,
        user: userData,
        isLoading: false,
      }));

      router.push(userData.role === Roles.ADMIN ? "/admin" : "/agent");

      return userData;
    } catch (error: any) {
      const errorMessage =
        error.message === "Failed with status: 400"
          ? "Invalid username or password"
          : error.message;

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  };

  // Add a function to check if the token is valid
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = decodeToken(token);
      if (userData) {
        setState((prev) => ({
          ...prev,
          user: userData,
        }));
      } else {
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const register = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    setState((prev) => ({ ...prev, isLoading: true, error: "" }));
    try {
      const registerData: RegisterDto = {
        Username: data.username.trim(),
        Email: data.email.trim(),
        Password: data.password.trim(),
      };

      console.log("Attempting registration with:", registerData);

      const response = await registerMutation.mutateAsync(registerData);
      console.log("Registration response:", response);

      // After successful registration, automatically log in
      return await login(data.username, data.password);
    } catch (error: any) {
      const errorMessage =
        error.message === "Failed with status: 400"
          ? "Registration failed. Please try again."
          : error.message;

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setState({
      user: null,
      isLoading: false,
      error: "",
    });
    router.push("/auth/login");
  };

  return {
    user: state.user,
    isLoading:
      state.isLoading || loginMutation.isPending || registerMutation.isPending,
    error: state.error,
    login,
    register,
    logout,
  };
};

export default useAuth;
 */