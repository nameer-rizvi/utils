import * as validate from "./validate.js";
import * as math from "./math.js";

type ObjectType = Record<string, unknown>;

/**
 * Rescales numeric values in an array to fit within a target range [rangeMin, rangeMax].
 * Mutates the input array in place.
 * For arrays of objects, specify `propName` to rescale a specific numeric property.
 * No-op if the array is empty, all values are equal (zero source range), or target range is invalid.
 * @example
 * const nums = [0, 50, 100];
 * rescale(nums);
 * // nums → [0, 50, 100] - already fits 0-100
 *
 * const nums2 = [0, 5, 10];
 * rescale(nums2);
 * // nums2 → [0, 50, 100] - rescaled to 0-100
 *
 * rescale(nums2, undefined, [0, 1]);
 * // nums2 → [0, 0.5, 1] - rescaled to 0-1
 *
 * const objs = [{ score: 0 }, { score: 5 }, { score: 10 }];
 * rescale(objs, "score");
 * // objs → [{ score: 0 }, { score: 50 }, { score: 100 }]
 */
export function rescale<T extends number | ObjectType>(
  input: T[],
  propName?: keyof ObjectType,
  [rangeMin, rangeMax]: [number, number] = [0, 100],
): void {
  if (!validate.isArrayNonEmpty(input)) return;

  let min = Infinity;

  let max = -Infinity;

  for (const item of input) {
    const value = propName ? (item as ObjectType)[propName] : item;

    if (!validate.isNumberValid(value)) continue;

    if (value < min) min = value;

    if (value > max) max = value;
  }

  const sourceRange = max - min;

  const targetRange = rangeMax - rangeMin;

  if (sourceRange === 0 || targetRange <= 0) return;

  const scale = targetRange / sourceRange;

  for (let i = 0; i < input.length; i++) {
    const raw = propName ? (input[i] as ObjectType)[propName] : input[i];

    if (!validate.isNumberValid(raw)) continue;

    const scaled = math.num(rangeMin + (raw - min) * scale);

    if (scaled === undefined) continue;

    if (propName) {
      (input[i] as ObjectType)[propName] = scaled;
    } else {
      input[i] = scaled as T;
    }
  }
}
