/**
 * Generates an RFC 4122-compliant UUID v4 string.
 * Uses `crypto.getRandomValues` where available for cryptographic randomness.
 * Falls back to `Math.random` in environments where `crypto` is unavailable.
 * @example
 * uuidv4()  // "110e8400-e29b-41d4-a716-446655440000" - random each call
 * uuidv4()  // "f47ac10b-58cc-4372-a567-0e02b2c3d479"
 */
export function uuidv4(): string {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint8Array(16);

    crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4

    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10xx

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));

    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");
  }

  // Fallback: non-cryptographic, not suitable for security-sensitive use cases
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
