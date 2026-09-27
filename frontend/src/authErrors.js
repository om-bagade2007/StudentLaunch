const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/missing-password": "Please enter your password.",
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/invalid-login-credentials": "Incorrect email or password. Please try again.",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "No account found with this email. Sign up to get started.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/network-request-failed": "Network error. Check your internet connection and try again.",
  "auth/operation-not-allowed": "Email and password sign-in is not enabled for this app.",
  "auth/invalid-api-key": "Authentication is not configured correctly. Please contact support.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    "Authentication is not configured correctly. Please contact support.",
};

export function getAuthErrorMessage(err) {
  const code = err?.code || "";
  if (AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return "Something went wrong. Please try again.";
}
