import axios from "axios";

const customFetch = axios.create({
  // Empty baseURL so all requests are relative (e.g. /api/auth/login)
  // and get forwarded by the Vite dev-server proxy to http://localhost:5000.
  // In production, set VITE_API_BASE_URL to the deployed API root.
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true, // Send cookies (httpOnly token) alongside every request
});

// Attach the stored JWT as a Bearer header on every request
customFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customFetch;
