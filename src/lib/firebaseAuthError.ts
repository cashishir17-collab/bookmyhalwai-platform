const RAW_CODE_PATTERN = /\(?(auth\/[a-z0-9-]+)\)?/i;

/**
 * Extracts a Firebase Auth error code (e.g. "auth/code-expired") from an
 * unknown thrown value. Checks the standard `.code` property first, then
 * falls back to parsing it out of `.message` — Firebase's default message
 * format is "Firebase: Error (auth/xxx-yyy)." — so a code check never
 * silently misses just because `.code` wasn't populated as expected.
 */
export function getFirebaseAuthErrorCode(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("code" in error && typeof (error as { code?: unknown }).code === "string") {
      return (error as { code: string }).code.toLowerCase();
    }
    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      const match = RAW_CODE_PATTERN.exec((error as { message: string }).message);
      if (match) return match[1].toLowerCase();
    }
  }
  return "";
}

const FRIENDLY_MESSAGES: Record<string, string> = {
  "auth/code-expired": "The OTP expired. Please request a new one.",
  "auth/session-expired": "The OTP session expired. Please request a new one.",
  "auth/invalid-verification-code": "That OTP is incorrect. Please re-enter the latest code.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment before trying again.",
  "auth/invalid-phone-number": "Enter a valid 10-digit mobile number.",
  "auth/quota-exceeded": "SMS limit reached for now. Please try again later.",
  "auth/missing-verification-code": "Enter the 6-digit OTP.",
  "auth/captcha-check-failed": "Verification check failed. Please refresh and try again.",
};

/**
 * A safe, user-facing message for a Firebase Auth error. Never returns the
 * raw SDK message (e.g. "Firebase: Error (auth/code-expired).") — known
 * codes get a specific friendly message, anything unrecognized gets a
 * generic fallback instead of leaking internal error text to the UI.
 */
export function getFriendlyAuthErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const code = getFirebaseAuthErrorCode(error);
  if (code && FRIENDLY_MESSAGES[code]) {
    return FRIENDLY_MESSAGES[code];
  }
  return fallback;
}
