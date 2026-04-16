import * as validate from "./validate.js";

/**
 * Converts one or more strings or arrays into a flat, trimmed list of non-empty strings.
 * Strings are split by comma, arrays are recursively processed.
 * @example
 * listify("a, b, c")               // ["a", "b", "c"]
 * listify("a", "b", "c")           // ["a", "b", "c"]
 * listify(["a", "b"], "c")         // ["a", "b", "c"]
 * listify("a, b", ["c", "d, e"])   // ["a", "b", "c", "d", "e"]
 * listify("a", null, "b")          // ["a", "b"] - non-strings ignored
 * listify("  a  ", "  b  ")        // ["a", "b"] - trimmed
 * listify()                        // []
 */
export function listify(...inputs: unknown[]): string[] {
  const list: string[] = [];
  for (const input of inputs) {
    const parts = validate.isString(input)
      ? input.split(",")
      : validate.isArray(input)
      ? listify(...(input as unknown[]))
      : [];
    for (const part of parts) {
      if (validate.isString(part)) {
        const v = part.trim();
        if (v) list.push(v);
      }
    }
  }
  return list;
}
