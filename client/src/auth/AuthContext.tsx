import React, { createContext, useContext, useMemo, useState } from "react";
import { authStorage, type AuthUser } from "./auth";

type AuthCtx = {
  user: AuthUser | null;
  token: string | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(authStorage.getToken());
  const [user, setUser] = useState<AuthUser | null>(authStorage.getUser());

  const isAdmin = !!token && user?.role === "admin";

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const raw = await res.text();
    let data: any = null;
    try { data = raw ? JSON.parse(raw) : null; } catch {}

    if (!res.ok) throw new Error(data?.error || raw || "Login failed");

    authStorage.setToken(data.token);
    authStorage.setUser(data.user);

    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    authStorage.clearAll();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, isAdmin, login, logout }), [user, token, isAdmin]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
