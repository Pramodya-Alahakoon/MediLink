import axios from "axios";

// Static mapping for production-like builds so the browser can reach backends directly over localhost
const getServiceBaseURL = (path) => {
  if (path.includes("/api/auth")) return "http://localhost:5000";
  if (path.includes("/api/appointments")) return "http://localhost:3002";
  if (path.includes("/api/doctors") || path.includes("/api/availability") || path.includes("/api/prescriptions")) return "http://localhost:3005";
  if (path.includes("/api/patients") || path.includes("/api/upload") || path.includes("/api/reports") || path.includes("/api/video-consultation")) return "http://localhost:3000";
  return "http://localhost:5000"; // Fallback URL
};

const customFetch = axios.create();

// Add request interceptor to include token
customFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Determine the absolute URL since we are running a built static frontend
    if (config.url && config.url.startsWith("/api")) {
      config.baseURL = getServiceBaseURL(config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to signin if unauthorized
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default customFetch;
