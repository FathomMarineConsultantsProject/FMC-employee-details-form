import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://fathom-financier-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Later (optional): attach token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });