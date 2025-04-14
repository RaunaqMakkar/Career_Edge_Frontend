// src/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add debugging to see what URL is being used
console.log("API URL:", process.env.REACT_APP_API_URL);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Log the full request URL for debugging
    console.log("Request URL:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
