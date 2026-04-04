// Non-secure JWT-style payload encoder/decoder. Not a real JWT implementation.

/**
 * Encodes a value into a base64url string.
 * Returns `undefined` if serialization fails.
 */
export function encode(input: unknown): string | undefined {
  try {
    const jsonString = JSON.stringify(input);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(jsonString, "utf-8").toString("base64url");
    }
    return btoa(jsonString)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return undefined;
  }
}

/**
 * Decodes a base64url string back to its original value.
 * Returns `undefined` if decoding or parsing fails.
 */
export function decode<T = unknown>(input: unknown): T | undefined {
  try {
    if (typeof input !== "string") return undefined;
    if (typeof Buffer !== "undefined") {
      return JSON.parse(Buffer.from(input, "base64url").toString("utf-8")) as T;
    }
    return JSON.parse(atob(input.replace(/-/g, "+").replace(/_/g, "/"))) as T;
  } catch {
    return undefined;
  }
}

// Aliases for backwards compatibility
export const decodeJson = decode;
export const decodeJSON = decode;
