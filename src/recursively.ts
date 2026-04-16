import * as validate from "./validate.js";

interface CallbackArgs {
  key: string;
  path: string;
  value: unknown;
  depth: number;
}

/**
 * Recursively traverses an object or array, invoking a callback for each primitive value.
 * Returns a new structure with the same shape, where each primitive is replaced by the callback's return value.
 * @example
 * recursively({ a: 1, b: { c: 2 } }, ({ value }) => value * 2)
 * // { a: 2, b: { c: 4 } }
 *
 * recursively([1, [2, 3]], ({ value }) => value + 10)
 * // [11, [12, 13]]
 *
 * recursively({ a: 1 }, ({ key, path, depth, value }) => `${path}=${value}`)
 * // { a: "a=1" }
 *
 * recursively({ a: { b: 1 } }, ({ path }) => path)
 * // { a: { b: "a.b" } }
 */
export function recursively(
  input: unknown,
  callback: (args: CallbackArgs) => unknown,
  depth = 0,
  path: [key: string, fullPath: string] = ["", ""],
): unknown {
  const [key, fullPath] = path;

  function makePath(curr: string | number): [string, string] {
    const newKey = String(curr);
    return [newKey, fullPath ? `${fullPath}.${newKey}` : newKey];
  }

  if (validate.isArray(input)) {
    const results: unknown[] = [];
    for (let i = 0; i < input.length; i++) {
      results.push(recursively(input[i], callback, depth + 1, makePath(i)));
    }
    return results;
  }

  if (validate.isObject(input)) {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      result[key] = recursively(input[key], callback, depth + 1, makePath(key));
    }
    return result;
  }

  return callback({ key, path: fullPath, value: input, depth });
}
