import * as validate from "./validate.js";

/**
 * Splits an array into batches of a given size.
 * Returns `undefined` if the input is not an array.
 * If `size` is 0 or negative, the entire array is returned as a single batch.
 * @example
 * batchify([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
 * batchify([1, 2, 3], 10)        // [[1, 2, 3]] - batch larger than array
 * batchify([1, 2, 3], 0)         // [[1, 2, 3]] - size 0 returns single batch
 * batchify("hello")              // undefined - not an array
 */
export function batchify<T>(input: T[], size = 10): T[][] | undefined {
  if (validate.isArray(input)) {
    if (size <= 0) return [input];

    const batches: T[][] = [];

    for (let i = 0; i < input.length; i += size) {
      batches.push(input.slice(i, i + size));
    }

    return batches;
  }
}
