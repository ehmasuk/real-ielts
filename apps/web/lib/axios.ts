import axios from "axios";
import { getAccessToken } from "./token-manager";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI || "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
