import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  const loc = useLocation();

  if (!isAdmin) return <Navigate to="/admin-login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
};
