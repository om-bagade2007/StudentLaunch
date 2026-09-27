import { auth } from "./firebase";

// The API is served from the same origin (Vercel /api function, Vite proxy in dev).
// Only honor VITE_API_URL when it is a real absolute URL that the browser can reach;
// a misconfigured value (e.g. "localhost:8080" or a localhost URL in production)
// otherwise causes every request to fail with "Failed to fetch".
function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    const isLocalTarget = ["localhost", "127.0.0.1"].includes(url.hostname);
    const isLocalPage = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLocalTarget && !isLocalPage) return "";
    return url.origin + url.pathname.replace(/\/+$/, "").replace(/\/api$/, "");
  } catch {
    return "";
  }
}

const API_BASE = resolveApiBase();

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) return { "Content-Type": "application/json" };
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function friendlyStatusMessage(status) {
  if (status === 401 || status === 403) return "Your session has expired. Please log in again.";
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status >= 500) return "Our server ran into a problem. Please try again in a moment.";
  return `Something went wrong (error ${status}). Please try again.`;
}

async function request(path, options = {}) {
  const headers = await authHeaders();
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    });
  } catch {
    const error = new Error(
      "Can't reach the server. Check your internet connection and try again."
    );
    error.status = 0;
    throw error;
  }

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const error = new Error(data?.error || friendlyStatusMessage(res.status));
    error.status = res.status;
    error.data = data;
    throw error;
  }
  if (text && data === null) {
    const error = new Error("The server sent an unexpected response. Please try again.");
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  getProfile: () => request("/api/profile"),
  saveProfile: (body) =>
    request("/api/profile", { method: "POST", body: JSON.stringify(body) }),
  getOpportunities: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.skill) query.set("skill", params.skill);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request(`/api/opportunities${suffix}`);
  },
  getOpportunity: (id) => request(`/api/opportunities/${id}`),
  getRecommendations: () => request("/api/recommendations"),
  getBookmarks: () => request("/api/bookmarks"),
  addBookmark: (opportunityId) =>
    request("/api/bookmarks", {
      method: "POST",
      body: JSON.stringify({ opportunityId }),
    }),
  removeBookmark: (opportunityId) =>
    request(`/api/bookmarks/${opportunityId}`, { method: "DELETE" }),
};
