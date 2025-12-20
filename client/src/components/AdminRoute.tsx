import { Navigate } from "react-router-dom";
import { isAdmin } from "@/auth/adminAuth";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  return isAdmin() ? children : <Navigate to="/admin-login" replace />;
};
