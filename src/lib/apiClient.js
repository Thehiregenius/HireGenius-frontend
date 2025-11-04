import axios from "axios";
import { BASE_URL } from "@/configs/constants";

// Centralized axios instance for the app.
// - baseURL comes from frontend constants (adjustable per environment)
// - withCredentials is enabled because the backend sets an httpOnly cookie named `token`
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Basic response interceptor: useful place to handle global auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Example: could emit a global event or perform a redirect to login.
      // Keep lightweight here — frontend pages can handle 401 specifically.
      console.warn("API 401 Unauthorized:", err.response && err.response.data);
    }
    return Promise.reject(err);
  }
);

export default api;
