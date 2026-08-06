/**
 * Maps raw Firebase Authentication error codes to friendly, human-readable
 * messages so users never see "Firebase: Error (auth/...)" text.
 *
 * Usage:
 *   import { getFriendlyAuthError } from '@/lib/firebaseErrors';
 *   ...
 *   catch (err) {
 *     setError(getFriendlyAuthError(err));
 *   }
 */

const AUTH_ERROR_MESSAGES = {
  // Sign in
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/timeout': 'The request timed out. Please try again.',

  // Sign up
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/missing-password': 'Please enter your password.',
  'auth/missing-email': 'Please enter your email address.',

  // Profile updates
  'auth/requires-recent-login': 'For your security, please sign in again to make this change.',
  'auth/credential-already-in-use': 'This credential is already linked to another account.',
  'auth/invalid-verification-code': 'The verification code is invalid. Please try again.',
  'auth/invalid-verification-id': 'The verification link is invalid or expired.',

  // Misc
  'auth/internal-error': 'Something went wrong on our end. Please try again.',
  'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email but a different sign-in method.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

/**
 * @param {unknown} error - The error thrown by a Firebase Auth call.
 * @returns {string} A friendly message for the user.
 */
export function getFriendlyAuthError(error) {
  // Errors we created ourselves (e.g. "Passwords do not match") have no code — show as-is.
  if (!error || typeof error !== 'object' || typeof error.message !== 'string') {
    return FALLBACK_MESSAGE;
  }

  const code = typeof error.code === 'string' ? error.code : '';

  // Known Firebase codes get the friendly message.
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  // Strip Firebase's "Firebase: Error (auth/...)" wrapper so we never show raw codes.
  if (code) {
    return FALLBACK_MESSAGE;
  }

  // Plain custom messages (no code) are already friendly — pass them through.
  return error.message || FALLBACK_MESSAGE;
}
