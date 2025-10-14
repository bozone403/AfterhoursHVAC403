import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import type { User } from "@/types/shared";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
};

// Create the auth context
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // Query to get the current user
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afterhourshvac403.onrender.com';
        const res = await fetch(`${API_BASE_URL}/api/user`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        if (res.status === 401) {
          return null;
        }
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to fetch user");
        }
        const userData = await res.json();
        console.log('useAuth - Successfully fetched user:', userData);
        return userData;
      } catch (err) {
        console.error('useAuth - Auth fetch error:', err);
        if ((err as Error).message === "Failed to fetch") {
          return null;
        }
        throw err;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afterhourshvac403.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }

      return res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afterhourshvac403.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for session management
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
      }

      return res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://afterhourshvac403.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: 'include', // Include cookies for session management
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}