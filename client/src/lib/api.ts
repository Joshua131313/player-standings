import { authStorage } from "@/auth/auth";

const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL?.trim() || "";
const API_BASE = RAW_BASE.endsWith("/") ? RAW_BASE.slice(0, -1) : RAW_BASE;

function buildUrl(path: string) {
  // DEV: keep /api so Vite proxy works
  if (!API_BASE) return path;

  // PROD: your server does NOT have /api prefix
  const fixedPath = path.replace(/^\/api\b/, "");
  return `${API_BASE}${fixedPath.startsWith("/") ? "" : "/"}${fixedPath}`;
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(init.headers || {});
  const isFormData = init.body instanceof FormData;

  if (token) headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = buildUrl(path);
  const res = await fetch(url, { ...init, headers });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        (typeof data === "string" ? data : "") ||
        `Request failed (${res.status})`
    );
  }

  return data as T;
}
