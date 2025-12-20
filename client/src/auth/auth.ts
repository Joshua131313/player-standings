const LS_TOKEN = "bfme_admin_token";
const LS_USER = "bfme_admin_user";

export type AuthUser = { email: string; role: "admin" };

export const authStorage = {
  getToken: () => localStorage.getItem(LS_TOKEN),
  setToken: (t: string) => localStorage.setItem(LS_TOKEN, t),
  getUser: (): AuthUser | null => {
    const raw = localStorage.getItem(LS_USER);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },
  setUser: (u: AuthUser) => localStorage.setItem(LS_USER, JSON.stringify(u)),
  clearAll: () => { localStorage.removeItem(LS_TOKEN); localStorage.removeItem(LS_USER); },
};
