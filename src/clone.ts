import * as validate from "./validate.js";

/**
 * Creates a shallow clone of the input value.
 * For arrays, returns a new array with the same elements.
 * For plain objects, returns a new object with the same key-value pairs.
 * All values (including `Date`, `RegExp`, `Map`, `Set`, functions) are copied by reference.
 * @example
 * shallow({ a: 1, b: { c: 2 } })   // { a: 1, b: { c: 2 } }    - b is same reference
 * shallow([1, 2, 3])               // [1, 2, 3]                - new array, same elements
 * shallow(new Date())              // same Date reference
 * shallow(() => {})                // same function reference
 * shallow("hello")                 // "hello"                  - primitives returned as-is
 */
export function shallow<T>(input: T): T {
  if (validate.isArray(input)) return [...input] as T;
  if (validate.isObject(input)) return { ...input };
  return input;
}

/**
 * Creates a deep clone of the input value by recursively cloning nested arrays and plain objects.
 * Primitives, functions, and special types (`Date`, `RegExp`, `Map`, `Set`) are copied by reference.
 * For full deep cloning of special types and circular references, use `cloneDeep` (lodash) instead.
 * @example
 * lite({ a: 1, b: { c: 2 } })   // { a: 1, b: { c: 2 } }  - b is a new object
 * lite([1, [2, 3], 4])          // [1, [2, 3], 4]         - nested array is cloned
 * lite(new Date())              // same Date reference    - not deeply cloned
 * lite("hello")                 // "hello"                - primitives returned as-is
 */
export function lite<T>(input: T): T {
  if (validate.isArray(input)) {
    const result = [];
    for (const item of input) result.push(lite(item));
    return result as T;
  }
  if (validate.isObject(input)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      result[key] = lite((input as Record<string, unknown>)[key]);
    }
    return result as T;
  }
  return input;
}

/**
 * Creates a full deep clone of the input value using lodash.
 * Handles special types (`Date`, `RegExp`, `Map`, `Set`), circular references, and more.
 * @see https://www.npmjs.com/package/lodash.clonedeep
 * @example
 * cloneDeep({ a: 1, b: { c: new Date() } })   // fully cloned, including Date
 * cloneDeep([1, [2, 3], 4])                   // fully cloned nested arrays
 */
export { default as deep } from "lodash.clonedeep"; // https://www.npmjs.com/package/lodash.clonedeep
