import * as validate from "./validate.js";
import * as clone from "./clone.js";

/**
 * Iterates over an array and splits it into two arrays based on a finder function.
 * Items matching the finder are replaced with `replaceWith` in the `replaced` array.
 * Items not matching are kept as-is in both arrays.
 * @example
 * removeArrayItems([1, 2, 3, 4], (n) => n % 2 === 0)
 * // { removed: [1, 3], replaced: [1, 3] } - evens removed, no replacement
 *
 * removeArrayItems([1, 2, 3, 4], (n) => n % 2 === 0, 0)
 * // { removed: [1, 3], replaced: [1, 0, 3, 0] } - evens replaced with 0
 *
 * removeArrayItems([], (n) => n > 0)
 * // { removed: [], replaced: [] }
 */
export function removeArrayItems<T>(
  input: T[] = [],
  finder: (item: T, index: number) => boolean,
  replaceWith?: T,
): { removed: T[]; replaced: T[] } {
  const removed: T[] = [];

  const replaced: T[] = [];

  if (validate.isArray(input)) {
    const source = clone.lite(input);

    for (let i = 0; i < source.length; i++) {
      const item = source[i];

      if (finder(item, i)) {
        if (replaceWith !== undefined) replaced.push(replaceWith);
      } else {
        removed.push(item);
        replaced.push(item);
      }
    }
  }

  return { removed, replaced };
}
