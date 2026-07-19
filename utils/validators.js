// utils/validators.js

// Validate email format
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validate password strength (min 6 chars, at least one number)
export function validatePassword(password) {
  const regex = /^(?=.*[0-9]).{6,}$/;
  return regex.test(password);
}

// Validate username (alphanumeric, 3–20 chars)
export function validateUsername(username) {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
}

// Validate priority (1–5)
export function validatePriority(priority) {
  return Number.isInteger(priority) && priority >= 1 && priority <= 5;
}

// Validate status (allowed values)
export function validateStatus(status) {
  const allowed = ["pending", "in-progress", "completed"];
  return allowed.includes(status);
}

// Validate date (must be valid ISO date string)
export function validateDate(date) {
  return !isNaN(Date.parse(date));
}
