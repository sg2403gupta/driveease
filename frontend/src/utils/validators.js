// Validate email format
export const validateEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

// Validate phone number (10 digits)
export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone);
};

// Validate password (minimum 6 characters)
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Validate booking dates
export const validateBookingDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { valid: false, message: "Start date cannot be in the past" };
  }

  if (end <= start) {
    return { valid: false, message: "End date must be after start date" };
  }

  return { valid: true, message: "" };
};
