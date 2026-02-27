import { toast } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE = `${API}/listings`;
const AUTH = `${API}/auth`;
const MSG  = `${API}/messages`;
const USERS = `${API}/users`;

// ── Auth header helper ─────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("token") || "";
}
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Generic JSON fetcher ───────────────────────────────────────────
async function req(url, options = {}, toastMsg) {
  const doFetch = async () => {
    const isFormData = options.body instanceof FormData;
    const res = await fetch(url, {
      headers: {
        ...authHeaders(),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || `Request failed (${res.status})`);
    }
    return res.status === 204 ? null : res.json();
  };

  if (toastMsg) {
    return toast.promise(doFetch(), {
      loading: toastMsg.loading || "Loading...",
      success: toastMsg.success || "Done!",
      error: (err) => toastMsg.error || err?.message || "Something went wrong",
    });
  }
  return doFetch();
}

// ── Listings ──────────────────────────────────────────────────────
export const listingsApi = {
  getAll: () => req(BASE),
  getStats: () => req(`${BASE}/stats`),
  create: (formData) => req(BASE, { method: "POST", body: formData },
    { loading: "Posting...", success: "Listing posted!" }),
  update: (id, formData) => req(`${BASE}/${id}`, { method: "PUT", body: formData },
    { loading: "Updating...", success: "Updated!" }),
  remove: (id) => req(`${BASE}/${id}`, { method: "DELETE" },
    { loading: "Deleting...", success: "Deleted!" }),
};

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  register: (payload) => req(`${AUTH}/register`, { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => req(`${AUTH}/login`, { method: "POST", body: JSON.stringify(payload) }),
  getMe: () => req(`${AUTH}/me`),
  updateMe: (payload) => req(`${AUTH}/me`, { method: "PATCH", body: JSON.stringify(payload) }),
};

// ── Users (admin) ─────────────────────────────────────────────────
export const usersApi = {
  getAll: () => req(USERS),
  update: (id, payload) => req(`${USERS}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id) => req(`${USERS}/${id}`, { method: "DELETE" },
    { loading: "Deleting...", success: "User deleted!" }),
};

// ── Messages ──────────────────────────────────────────────────────
export const messagesApi = {
  send: (payload) => req(MSG, { method: "POST", body: JSON.stringify(payload) },
    { loading: "Sending...", success: "Message sent!" }),
  getAll: () => req(MSG),
  updateStatus: (id, status) => req(`${MSG}/${id}`, { method: "PATCH", body: JSON.stringify({ status }) },
    { loading: "Updating...", success: `Marked as ${status.toLowerCase()}!` }),
};

// ── localStorage helpers ──────────────────────────────────────────
export function saveAuth({ user, token }) {
  localStorage.setItem("token", token);
  localStorage.setItem("userToken", JSON.stringify(user));
  if (user.isAdmin) localStorage.setItem("admin", JSON.stringify(user));
  else localStorage.removeItem("admin");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userToken");
  localStorage.removeItem("admin");
}
