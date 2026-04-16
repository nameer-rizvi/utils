import * as validate from "./validate.js";

/**
 * Converts an array of key-value pairs into an object.
 * Equivalent to `Object.fromEntries` but with validation and a safe empty fallback.
 * Returns `{}` if the input is not a non-empty array.
 * @example
 * reduceObject([["a", 1], ["b", 2]])   // { a: 1, b: 2 }
 * reduceObject([["a", 1], ["a", 2]])   // { a: 2 } - last value wins
 * reduceObject([])                     // {}
 * reduceObject()                       // {}
 */
export function reduceObject(
  input: [string, unknown][] = [],
): Record<string, unknown> {
  if (!validate.isArrayNonEmpty(input)) return {};
  return Object.fromEntries(input);
}
