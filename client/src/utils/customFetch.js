import axios from "axios";

// Determine service base URL based on API path
const getServiceBaseURL = (path) => {
  if (path.includes("/api/auth")) {
    return "http://localhost:5000";
  }
  if (path.includes("/api/appointments")) {
    return "http://localhost:5002";
  }
  if (path.includes("/api/doctor")) {
    return "http://localhost:3003";
  }
  if (path.includes("/api/patient")) {
    return "http://localhost:3004";
  }
  if (path.includes("/api/payment")) {
    return "http://localhost:3005";
  }
  
  // Fallback to environment variable or default
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
};

const customFetch = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
});

// Add request interceptor to include token and handle dynamic base URLs
customFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Update baseURL based on the endpoint path
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
