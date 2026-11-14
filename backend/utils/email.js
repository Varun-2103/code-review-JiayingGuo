const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Emails are saved trimmed and lowercase, so "Demo@X.com " and "demo@x.com"
// are the same account.
export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email) && email.length <= 254;
}
