import api from "./axiosConfig";

// Create new booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/api/bookings", bookingData);
  return response.data;
};

// Get user's bookings
export const getMyBookings = async () => {
  const response = await api.get("/api/bookings/my-bookings");
  return response.data;
};

// Get single booking
export const getBookingById = async (id) => {
  const response = await api.get(`/api/bookings/${id}`);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id, cancellationReason) => {
  const response = await api.put(`/api/bookings/${id}/cancel`, {
    cancellationReason,
  });
  return response.data;
};

// Get all bookings (Admin)
export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);

  const response = await api.get(`/api/admin/bookings?${params.toString()}`);
  return response.data;
};

// Update booking status (Admin)
export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/api/admin/bookings/${id}/status`, {
    status,
  });
  return response.data;
};
