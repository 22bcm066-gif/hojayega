const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("hstle_access_token");
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null; noAuth?: boolean } = {},
): Promise<T> {
  const token = options.noAuth ? undefined : (options.token ?? getToken());
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = (data && (data.message as string)) || res.statusText;
    throw new ApiError(res.status, Array.isArray(message) ? message.join(", ") : message, data);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => apiFetch<T>(path, { token }),
  post: <T>(path: string, body?: unknown, token?: string | null) => apiFetch<T>(path, { method: "POST", body, token }),
  patch: <T>(path: string, body?: unknown, token?: string | null) => apiFetch<T>(path, { method: "PATCH", body, token }),
  delete: <T>(path: string, token?: string | null) => apiFetch<T>(path, { method: "DELETE", token }),
};

export const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000/realtime";
