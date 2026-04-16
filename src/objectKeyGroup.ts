import * as validate from "./validate.js";

interface GroupedObject {
  keys: string[];
  keysStripped: string[];
  extracted: Record<string, unknown>;
  extractedStripped: Record<string, unknown>;
}

/**
 * Groups and extracts keys from an object based on a regex pattern.
 * Returns both the matched keys and a version with the matched portion stripped.
 * @example
 * objectKeyGroup({ fooA: 1, fooB: 2, bar: 3 }, /^foo/)
 * // { keys: ["fooA", "fooB"], keysStripped: ["A", "B"], extracted: { fooA: 1, fooB: 2 }, ... }
 *
 * objectKeyGroup({ aFoo: 1, bFoo: 2, bar: 3 }, /Foo$/)
 * // { keys: ["aFoo", "bFoo"], keysStripped: ["a", "b"], extracted: { aFoo: 1, bFoo: 2 }, ... }
 *
 * objectKeyGroup({ fooA: 1, bar: null }, /^foo/)
 * // { keys: ["fooA"], ... } - null value excluded
 *
 * objectKeyGroup({})
 * // { keys: [], keysStripped: [], extracted: {}, extractedStripped: {} }
 */
export function objectKeyGroup(
  input: Record<string, unknown> = {},
  pattern: RegExp,
): GroupedObject {
  const keys: string[] = [];

  if (validate.isRegex(pattern)) {
    for (const key of Object.keys(input)) if (pattern.test(key)) keys.push(key);
  }

  const extracted: Record<string, unknown> = {};

  const keysStripped: string[] = [];

  const extractedStripped: Record<string, unknown> = {};

  for (const key of keys) {
    extracted[key] = input[key];

    const stripped = pattern ? key.replace(pattern, "") : key;

    keysStripped.push(stripped);

    extractedStripped[stripped] = input[key];
  }

  return { keys, keysStripped, extracted, extractedStripped };
}
