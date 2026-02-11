import { toast } from "react-hot-toast";

const BASE = "http://localhost:3000/listings";

async function req(url, options = {}) {
  const doFetch = async () => {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.status === 204 ? null : res.json();
  };

  return doFetch();
}

export const listingsApi = {
  getAll: () =>
    req(BASE, {}, { loading: "Loading listings...",}),

  create: (payload) =>
    req(
      BASE,
      { method: "POST", body: JSON.stringify(payload) },
      { loading: "Creating...", success: "Created", error: "Erroe "}
    ),

  update: (id, payload) =>
    req(
      `${BASE}/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      { loading: "Updating...", success: "Updated" }
    ),

  remove: (id) =>
    req(
      `${BASE}/${id}`,
      { method: "DELETE" },
      { loading: "Deleting...", success: "Deleted" }
    ),
};
