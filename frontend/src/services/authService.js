import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* Attach token automatically */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* LOGIN */
export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

/* REGISTER */
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

/* ADMIN */
export const fetchAllUsers = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};
