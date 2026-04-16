import * as validate from "./validate.js";

/**
 * Safely parses a JSON string into a typed value.
 * Returns `undefined` if the input is not a string, is empty, or is invalid JSON.
 * @example
 * parseJson('{"a":1}')           // { a: 1 }
 * parseJson<number[]>("[1,2,3]") // [1, 2, 3]
 * parseJson("true")              // true
 * parseJson('"hello"')           // "hello"
 * parseJson("{invalid}")         // undefined - invalid JSON
 * parseJson("")                  // undefined - empty string
 * parseJson(123)                 // undefined - not a string
 */
export function parseJson<T = unknown>(input: unknown): T | undefined {
  if (!validate.isString(input)) return;

  const trimmed = input.trim();

  if (!trimmed) return;

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return;
  }
}
