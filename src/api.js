// src/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  topURL: "http://localhost:5001/api/chat",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
