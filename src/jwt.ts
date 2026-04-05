import * as base64 from "./base64.js";

const EMPTY = base64.encodeJson("");

function toBase64Url(input: string): string {
  return input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  return input.replace(/-/g, "+").replace(/_/g, "/");
}

/**
 * Encodes a value into a non-secure JWT-style token with an empty header and no signature.
 * Returns `undefined` if the payload cannot be serialized.
 * @example
 * encode({ id: 1, name: "John" })  // "IiI=.eyJpZCI6MSwibmFtZSI6IkpvaG4ifQ==."
 * encode(undefined)                // undefined
 */
export function encode(input: unknown): string | undefined {
  const payload = base64.encodeJson(input);
  if (payload !== undefined) return `${EMPTY}.${toBase64Url(payload)}.${EMPTY}`;
}

/**
 * Decodes the payload from a JWT or JWT-style token.
 * The signature is NOT verified — this is not a secure JWT implementation.
 * Returns `undefined` if the token is malformed or the payload cannot be decoded.
 * @example
 * decode(encode({ id: 1 }))  // { id: 1 }
 * decode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature")
 *                            // { sub: "1234567890", name: "John Doe", iat: 1516239022 }
 * decode("not-a-jwt")        // undefined
 * decode(123)                // undefined
 */
export function decode<T = unknown>(input: unknown): T | undefined {
  if (typeof input === "string") {
    const parts = input.split(".");
    if (parts.length === 3) {
      return base64.decodeJson<T>(fromBase64Url(parts[1]));
    }
  }
}

// Aliases for backwards compatibility
export const encodeJSON = encode;
export const encodeJson = encode;
export const decodeJSON = decode;
export const decodeJson = decode;
