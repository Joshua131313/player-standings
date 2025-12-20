import {jwtDecode} from "jwt-decode";

type AdminPayload = {
  role?: string;
  exp?: number;
};

export const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

export const isAdmin = (): boolean => {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode<AdminPayload>(token);

    // optional expiration check
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken");
      return false;
    }

    return decoded.role === "admin";
  } catch {
    return false;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
};
