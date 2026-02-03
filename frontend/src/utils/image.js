const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder-vehicle.webp";
  return `${API_URL}/uploads/${imagePath}`;
};
