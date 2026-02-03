import api from "./axiosConfig";

// Process payment
export const processPayment = async (paymentData) => {
  const response = await api.post("/payments/process", paymentData);
  return response.data;
};

// Get payment by booking ID
export const getPaymentByBooking = async (bookingId) => {
  const response = await api.get(`/payments/booking/${bookingId}`);
  return response.data;
};

// Get dashboard stats (Admin)
export const getDashboardStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};
