import api from "./axiosConfig";

// Register new user
export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};
