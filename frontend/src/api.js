import { auth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_URL || "";

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) return { "Content-Type": "application/json" };
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request(path, options = {}) {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
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
