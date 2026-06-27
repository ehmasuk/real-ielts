import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080/api",
  withCredentials: true,
});

// We can add interceptors here later to handle bearer tokens
api.interceptors.request.use((config) => {
  // Example for handling authentication token:
  // const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
