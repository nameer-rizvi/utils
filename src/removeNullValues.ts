import * as validate from "./validate.js";

/**
 * Returns a new object with all `null` and `undefined` values removed.
 * Does not mutate the input object.
 * @example
 * removeNullValues({ a: 1, b: null, c: undefined, d: 0 })   // { a: 1, d: 0 }
 * removeNullValues({ a: null, b: null })                    // {}
 * removeNullValues({ a: 1, b: "hello" })                    // { a: 1, b: "hello" }
 * removeNullValues({})                                      // {}
 */
export function removeNullValues<T extends Record<string, unknown>>(
  input: T = {} as T,
): Partial<T> {
  if (!validate.isObject(input)) return {};

  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value !== null && value !== undefined) {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}
