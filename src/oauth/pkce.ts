import crypto from 'crypto';

/**
 * Generate a cryptographically random code verifier for PKCE
 * @returns Base64URL-encoded random string (43-128 characters)
 */
export function generateCodeVerifier(): string {
  const buffer = crypto.randomBytes(32);
  return base64URLEncode(buffer);
}

/**
 * Generate code challenge from code verifier using SHA256
 * @param verifier - The code verifier to hash
 * @returns Base64URL-encoded SHA256 hash of the verifier
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Generate a cryptographically random state parameter
 * @returns Random state string for CSRF protection
 */
export function generateState(): string {
  const buffer = crypto.randomBytes(16);
  return base64URLEncode(buffer);
}

/**
 * Base64URL encode a buffer (URL-safe base64 without padding)
 * @param buffer - Buffer to encode
 * @returns Base64URL-encoded string
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
