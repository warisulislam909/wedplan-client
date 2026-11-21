// Express backend এর জন্য fetch wrapper: Better Auth session → short-lived JWT → Authorization header
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let cache = { token: null, exp: 0 };
export const clearToken = () => (cache = { token: null, exp: 0 });

async function getToken() {
  if (cache.token && Date.now() < cache.exp) return cache.token;
  const res = await fetch("/api/token", { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || "Please sign in to continue");
  }
  const { token } = await res.json();
  cache = { token, exp: Date.now() + 10 * 60 * 1000 };
  return token;
}

export async function api(path, { method = "GET", body, auth = true, retry = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${await getToken()}`;
  let res;
  try {
    res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Check your connection and try again.");
  }
  if (res.status === 401 && auth && retry) {
    clearToken();
    return api(path, { method, body, auth, retry: false });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.message || "Something went wrong", data.code);
  return data;
}

export const qs = (params) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== null && v !== "" && v !== "all" && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : "";
};
