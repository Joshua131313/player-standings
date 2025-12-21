import { authStorage } from "@/auth/auth";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.trim() || "";

function joinUrl(base: string, path: string) {
  if (!base) return path; // dev: "/api/players"
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(init.headers || {});

  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Only set JSON content-type if body is JSON (not FormData)
  const isFormData = init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = joinUrl(API_BASE, path);

  const res = await fetch(url, { ...init, headers });

  // Some endpoints might return empty body
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text; // keep raw if not JSON
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      (typeof data === "string" ? data : "") ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}
