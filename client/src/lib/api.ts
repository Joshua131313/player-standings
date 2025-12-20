import { authStorage } from "@/auth/auth";

export async function apiFetch<T = any>(url: string, init: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(init.headers || {});

  // attach admin token if present
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Do NOT set Content-Type for FormData (browser must set boundary)
  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  // If sending JSON and no Content-Type provided, set it
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...init, headers });

  // Always read response once here
  const raw = await res.text();

  // Try JSON parse, else keep string
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw || null;
  }

  // Throw on non-2xx (callers must use try/catch)
  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      raw ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}
