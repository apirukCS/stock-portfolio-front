import axios from "axios";
import { ACCESS_TOKEN } from "../utils/const/local-storage-const";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    
    if (token && !['/auth'].includes(config.url ?? '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN);
      window.location.href = "/auth/sign-in";
    }

    if (error.response?.data?.message) {
      return Promise.reject(error.response.data.message);
    }

    return Promise.reject(error);
  }
);
