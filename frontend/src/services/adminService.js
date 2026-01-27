import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin"
});

// Dynamic token injection via interceptor (not static header)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const getAllAppointments = async () => {
  const res = await API.get("/appointments");
  return res.data;
};

export const getAdminStats = async () => {
  const res = await API.get("/stats");
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await API.patch(`/users/${userId}/toggle-status`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await API.delete(`/users/${userId}`);
  return res.data;
};

