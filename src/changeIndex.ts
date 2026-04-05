/**
 * Moves an element in an array from one index to another.
 * Mutates the input array in place.
 * If `newIndex` is beyond the array bounds, the array is extended with empty slots.
 * If `oldIndex` is out of bounds, the original array is returned unchanged.
 * @example
 * changeIndex([1, 2, 3, 4], 0, 2)  // [2, 3, 1, 4] - move first to index 2
 * changeIndex([1, 2, 3, 4], 3, 0)  // [4, 1, 2, 3] - move last to first
 * changeIndex([1, 2, 3], 0, 10)    // [, , , , , , , , , , 1] - extends array
 * changeIndex([1, 2, 3], 5, 0)     // [1, 2, 3] - oldIndex out of bounds, unchanged
 * @throws {Error} If `oldIndex` or `newIndex` is not a valid integer.
 */
export function changeIndex<T>(
  input: T[] = [],
  oldIndex: number,
  newIndex: number,
): T[] {
  if (!Number.isInteger(oldIndex)) {
    throw new Error('Second argument ("old index") is not a valid integer.');
  }

  if (!Number.isInteger(newIndex)) {
    throw new Error('Third argument ("new index") is not a valid integer.');
  }

  if (oldIndex < 0 || oldIndex >= input.length) {
    return input;
  }

  if (newIndex >= input.length) {
    input.length = newIndex + 1; // Extend array length if necessary.
  }

  input.splice(newIndex, 0, input.splice(oldIndex, 1)[0]);

  return input;
}
