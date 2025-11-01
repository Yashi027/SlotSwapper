

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

export async function api(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Prepare fetch options
  const options = {
    method,
    headers,
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw { status: res.status, data };
    }

    return data;
  } catch (err) {
    console.error("API error:", err);
    throw err;
  }
}
