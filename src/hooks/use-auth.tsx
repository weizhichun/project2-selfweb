"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import bcrypt from "bcryptjs";

const PASSWORD_KEY = "self-web-password-hash";
const AUTH_SESSION_KEY = "self-web-auth-session";

interface AuthContextType {
  isAuthenticated: boolean;
  hasPassword: boolean;
  isLoading: boolean;
  setPassword: (password: string) => Promise<boolean>;
  verifyPassword: (password: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const passwordHash = localStorage.getItem(PASSWORD_KEY);
    const session = localStorage.getItem(AUTH_SESSION_KEY);

    setHasPassword(!!passwordHash);

    if (session) {
      try {
        const sessionData = JSON.parse(session);
        if (sessionData.expires > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(AUTH_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_SESSION_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const setPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      localStorage.setItem(PASSWORD_KEY, hash);
      setHasPassword(true);
      return true;
    } catch (error) {
      console.error("Failed to set password:", error);
      return false;
    }
  }, []);

  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      const passwordHash = localStorage.getItem(PASSWORD_KEY);
      if (!passwordHash) return false;

      const isValid = await bcrypt.compare(password, passwordHash);
      if (isValid) {
        const session = {
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        };
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        setIsAuthenticated(true);
      }
      return isValid;
    } catch (error) {
      console.error("Failed to verify password:", error);
      return false;
    }
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      try {
        const passwordHash = localStorage.getItem(PASSWORD_KEY);
        if (!passwordHash) return false;

        const isValid = await bcrypt.compare(oldPassword, passwordHash);
        if (!isValid) return false;

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);
        localStorage.setItem(PASSWORD_KEY, newHash);
        return true;
      } catch (error) {
        console.error("Failed to change password:", error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasPassword,
        isLoading,
        setPassword,
        verifyPassword,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
