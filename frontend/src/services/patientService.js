import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getPatientAppointments = () =>
  API.get("/appointments/patient");

export const getPatientPrescriptions = () =>
  API.get("/prescriptions/patient");

export const getPatientEHRs = () =>
  API.get("/ehr/patient");
