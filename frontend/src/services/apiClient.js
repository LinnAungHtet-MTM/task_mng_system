import axios from "axios";

const API = import.meta.env.VITE_API;
const AUTH = import.meta.env.VITE_AUTH_API;

export const apiClient = axios.create({
  baseURL: API,
});

export const authClient = axios.create({
  baseURL: AUTH,
});

apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const loginUser = JSON.parse(user);
    if (loginUser && loginUser.token) {
      config.headers["authorization"] = "Bearer " + loginUser.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
