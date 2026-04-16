import * as validate from "./validate.js";
import * as base64 from "./base64.js";

/**
 * Converts a base64url-encoded string to a `Uint8Array`.
 * Handles padding normalization and base64url → base64 character conversion.
 * Useful for working with Web Push VAPID keys and similar binary data.
 * Returns `undefined` if the input is not a valid base64 string or decoding fails.
 * @see https://gist.github.com/Klerith/80abd742d726dd587f4bd5d6a0ab26b6
 * @example
 * urlBase64ToUint8Array("SGVsbG8gV29ybGQ=")   // Uint8Array [72, 101, 108, 108, 111, ...]
 * urlBase64ToUint8Array("SGVsbG8")            // Uint8Array - padding added automatically
 * urlBase64ToUint8Array("invalid!")           // undefined  - not valid base64
 * urlBase64ToUint8Array(123)                  // undefined  - not a string
 */
export function urlBase64ToUint8Array(input: unknown): Uint8Array | undefined {
  if (validate.isBase64(input)) {
    const padding = "=".repeat((4 - (input.length % 4)) % 4);

    const normalized = (input + padding).replace(/-/g, "+").replace(/_/g, "/");

    const decoded = base64.decode(normalized);

    if (!decoded) return;

    const uint8Array = new Uint8Array(decoded.length);

    for (let i = 0; i < decoded.length; i++) {
      uint8Array[i] = decoded.charCodeAt(i);
    }

    return uint8Array;
  }
}
