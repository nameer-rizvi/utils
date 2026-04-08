import * as validate from "./validate.js";

/**
 * Flattens a nested object into a single-level object using a delimiter to join keys.
 * Uses `_` instead of `.` as the default delimiter for object name compatibility.
 * Non-plain-object values (arrays, primitives, etc.) are kept as-is.
 * Uses an iterative stack approach to avoid recursion limits on deeply nested objects.
 * @example
 * flatten({ a: { b: { c: 1 } } })             // { a_b_c: 1 }
 * flatten({ a: { b: 1 }, c: 2 })              // { a_b: 1, c: 2 }
 * flatten({ a: { b: 1 } }, ".")               // { "a.b": 1 }
 * flatten({ a: [1, 2, 3] })                   // { a: [1, 2, 3] } - arrays kept as-is
 * flatten({ a: { b: 1 }, c: { d: { e: 2 } }}) // { a_b: 1, c_d_e: 2 }
 * flatten({})                                 // {}
 */
export function flatten(
  input: Record<string, unknown> = {},
  delimiter = "_",
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  const stack: Array<{ obj: Record<string, unknown>; prefix: string }> = [
    { obj: input, prefix: "" },
  ];

  while (stack.length) {
    const { obj, prefix } = stack.pop()!;

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

      if (validate.isObject(value)) {
        stack.push({ obj: value, prefix: newKey });
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}
