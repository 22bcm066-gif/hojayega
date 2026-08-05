"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";
import type { User } from "./types";

interface VerifyOtpResult {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  user: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string, name?: string, referralCode?: string) => Promise<VerifyOtpResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "hstle_access_token";
const REFRESH_KEY = "hstle_refresh_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.get<User>("/auth/me", token);
      setUser(me);
    } catch {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(REFRESH_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const requestOtp = useCallback(async (phone: string) => {
    await api.post("/auth/otp/request", { phone });
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string, name?: string, referralCode?: string) => {
    const result = await api.post<VerifyOtpResult>("/auth/otp/verify", { phone, otp, name, referralCode });
    window.localStorage.setItem(TOKEN_KEY, result.accessToken);
    window.localStorage.setItem(REFRESH_KEY, result.refreshToken);
    setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, requestOtp, verifyOtp, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
