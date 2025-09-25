import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/sup-admin",
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addUsers = (payload, token) =>
  API.post("/add-users", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPendingUsers = () => API.get("/pending-users");

export const approveUserById = (id) => API.put(`/approve-users/${id}`);

export const declineUserById = (id) => API.delete(`/decline-user/${id}`);

export const assignRoleToUser = (email, role) =>
  API.post("/assign-role", { email, role });

export const createProject = (payload, token) =>
  API.post("/create-project", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProject = (data) => API.post("/update-project", data);

export const getProject = () => API.get("/get-project");

export const getProjectById = (projectCode, token) => {
  return API.get(`/getProjectbyId/${projectCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createTask = (taskData) => API.post("/create-task", taskData);

export const updateTask = (taskData) => API.post("/update-task", taskData);

export const getTask = () => API.get("/get-task");

export const getTaskById = (taskId, token) => {
  return API.get(`/gettaskbyId/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
