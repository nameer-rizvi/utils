import * as validate from "./validate.js";

/**
 * Encodes a string to base64.
 * Returns `undefined` if the input is not a string.
 * @example
 * encode("hello")  // "aGVsbG8="
 * encode(123)      // undefined - not a string
 */
export function encode(input: unknown): string | undefined {
  if (validate.isString(input)) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(input, "utf-8").toString("base64");
    } else if (typeof btoa !== "undefined") {
      return btoa(input); // btoa(encodeURIComponent(input))
    }
  }
}

/**
 * Decodes a base64 string back to its original value.
 * Returns `undefined` if the input is not a valid base64 string.
 * @example
 * decode("aGVsbG8=")  // "hello"
 * decode("invalid!")  // undefined
 */
export function decode(input: unknown): string | undefined {
  if (validate.isBase64(input)) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(input, "base64").toString("utf-8");
    } else if (typeof atob !== "undefined") {
      return atob(input); // decodeURIComponent(atob(input))
    }
  }
}

/**
 * Encodes a JSON-serializable value to a base64 string.
 * Returns `undefined` if the input is not JSON-serializable.
 * @example
 * encodeJson({ a: 1 })  // "eyJhIjoxfQ=="
 * encodeJson(undefined) // undefined
 */
export function encodeJson(input: unknown): string | undefined {
  if (validate.isJson(input)) {
    return encode(JSON.stringify(input));
  }
}

/**
 * Decodes a base64 string back to its original JSON value.
 * Returns `undefined` if the input is not a valid base64-encoded JSON string.
 * @example
 * decodeJson("eyJhIjoxfQ==")  // { a: 1 }
 * decodeJson("aGVsbG8=")      // undefined - not JSON
 */
export function decodeJson<T = unknown>(input: unknown): T | undefined {
  const decoded = decode(input);
  if (validate.isJsonString(decoded)) {
    return JSON.parse(decoded) as T;
  }
}

// Aliases for backwards compatibility
export const encodeJSON = encodeJson;
export const decodeJSON = decodeJson;
