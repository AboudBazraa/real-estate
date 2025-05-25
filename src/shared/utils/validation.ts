/**
 * Validation utilities for form inputs
 */

/**
 * Validates a phone number in international format
 * @param phone - The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export function validatePhoneNumber(phone: string | null | undefined): boolean {
  if (!phone) return true; // Empty values are considered valid (optional field)
  return /^\+?[0-9]{10,15}$/.test(phone);
}

/**
 * Formats a phone number to international format if possible
 * @param phone - The phone number to format
 * @returns formatted phone number or original if cannot be formatted
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";

  // Remove all non-digit characters except leading +
  const cleaned = phone.startsWith("+")
    ? "+" + phone.substring(1).replace(/\D/g, "")
    : phone.replace(/\D/g, "");

  // If US number without country code, add +1
  if (cleaned.length === 10 && !phone.startsWith("+")) {
    return `+1${cleaned}`;
  }

  return cleaned;
}

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns boolean indicating if the email is valid
 */
export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false; // Email is required
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Checks if a value is empty (null, undefined, or empty string)
 * @param value - The value to check
 * @returns boolean indicating if the value is empty
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === "";
}

/**
 * Validates a username
 * @param username - The username to validate
 * @returns boolean indicating if the username is valid
 */
export function validateUsername(username: string): boolean {
  if (!username) return false;
  return username.length >= 3 && username.length <= 30;
}
