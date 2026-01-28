import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

/* 🔐 Attach JWT token dynamically */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* USERS */
export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await API.patch(`/users/${userId}/toggle`);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await API.delete(`/users/${userId}`);
  return res.data;
};

/* ADMIN STATS */
export const getAdminStats = async () => {
  const res = await API.get("/stats");
  return res.data;
};

/* 🧾 AUDIT LOGS — STEP 6.5 */
export const fetchAuditLogs = async () => {
  const res = await API.get("/audit-logs");
  return res.data;
};
