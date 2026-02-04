import api from "./axiosConfig";

// Get all vehicles with optional filters
export const getAllVehicles = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.type) params.append("type", filters.type);
  if (filters.available !== undefined) {
    params.append("available", filters.available);
  }

  const response = await api.get(`/api/vehicles?${params.toString()}`);
  return response.data;
};

// Get single vehicle
export const getVehicleById = async (id) => {
  const response = await api.get(`/api/vehicles/${id}`);
  return response.data;
};

// Create vehicle (Admin)
export const createVehicle = async (vehicleData) => {
  const response = await api.post("/api/vehicles", vehicleData);
  return response.data;
};

// Update vehicle (Admin)
export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`/api/vehicles/${id}`, vehicleData);
  return response.data;
};

// Delete vehicle (Admin)
export const deleteVehicle = async (id) => {
  const response = await api.delete(`/api/vehicles/${id}`);
  return response.data;
};
