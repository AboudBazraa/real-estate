import { createClient } from "@/shared/utils/supabase/client";
import { SUPABASE_CONFIG } from "@/shared/config/supabase";

const supabase = createClient();

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async register(email: string, password: string, userData: any) {
    // Step 1: Register the user
    const { data, error: registrationError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: SUPABASE_CONFIG.redirectUrl,
      },
    });

    // Step 2: Handle registration errors
    if (registrationError) {
      console.error("Error during registration:", registrationError.message);
      throw registrationError;
    }

    try {
      // Step 3: Assign default role to the new user using RPC
      if (data.user) {
        const { error: profileError } = await supabase.rpc("add_user_profile", {
          p_user_id: data.user.id,
          p_role_name: userData.role || "user", // Use provided role or default to 'user'
        });

        // Step 4: Handle profile assignment errors
        if (profileError) {
          console.error("Error assigning default role:", profileError.message);
          throw profileError;
        }

        console.log("User registered successfully and default role assigned!");
      } else {
        console.warn("Cannot assign role: user object is null");
      }
    } catch (error) {
      // If the RPC call fails but user is created, return the user data anyway
      console.warn("Created user but couldn't assign role:", error);
    }

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getUser() {
    try {
      const { data, error } = await supabase.auth.getSession();

      // Check if session exists first
      if (!data.session) {
        return null;
      }

      // Only get user if we have a session
      const userResult = await supabase.auth.getUser();
      if (userResult.error) throw userResult.error;
      return userResult.data.user;
    } catch (error) {
      console.error("Auth error:", error);
      return null;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string) {
    try {
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // If verification passed, update the password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Password update error:", error);
      throw error;
    }
  },

  /**
   * Initiates a password reset for a user
   * @param email The email address of the user
   * @param redirectTo Optional URL to redirect to after password reset
   */
  async resetPassword(email: string, redirectTo?: string) {
    try {
      // Configure the password reset with an optional redirect URL
      const options = redirectTo ? { redirectTo } : undefined;

      // Send the password reset email
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        email,
        options
      );

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Password reset error:", error);
      throw error;
    }
  },

  /**
   * Resend the verification email for a user
   * @param email The email address of the user
   */
  async resendVerificationEmail(email: string) {
    try {
      // Request a new verification email
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: SUPABASE_CONFIG.redirectUrl,
        },
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Verification email resend error:", error);
      throw error;
    }
  },
};

// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// interface AuthState {
//   user: any;
//   isLoading: boolean;
//   error: string;
// }

// const useAuth = () => {
//   const [state, setState] = useState<AuthState>({
//     user: null,
//     isLoading: false,
//     error: "",
//   });
//   const router = useRouter();

//   const login = async (email: string, password: string) => {
//     setState((prev) => ({ ...prev, isLoading: true, error: "" }));
//     try {
//       const response = await axios.post("/api/auth/login", {
//         email,
//         password,
//       });
//       const token = response.data.token;
//       localStorage.setItem("authToken", token);
//       router.push("/dashboard");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         setState((prev) => ({
//           ...prev,
//           error: error.response?.data?.message || "Login failed",
//           isLoading: false,
//         }));
//       }
//     }
//   };

//   const register = async (email: string, password: string) => {
//     setState((prev) => ({ ...prev, isLoading: true, error: "" }));
//     try {
//       const response = await axios.post("/api/auth/register", {
//         email,
//         password,
//       });
//       router.push("/dashboard");
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         setState((prev) => ({
//           ...prev,
//           error: error.response?.data?.message || "Registration failed",
//           isLoading: false,
//         }));
//       }
//     }
//   };

//   const logout = async () => {
//     setState((prev) => ({ ...prev, isLoading: true, error: "" }));
//     try {
//       localStorage.removeItem("authToken");
//       router.push("/auth");
//     } catch (error) {
//       setState((prev) => ({
//         ...prev,
//         error: "Logout failed",
//         isLoading: false,
//       }));
//     }
//   };

//   return {
//     user: state.user,
//     isLoading: state.isLoading,
//     error: state.error,
//     login,
//     register,
//     logout,
//   };
// };

// export default useAuth;
