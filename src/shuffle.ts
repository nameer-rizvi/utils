/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * Mutates the input array and returns it.
 * @example
 * shuffle([1, 2, 3, 4, 5])  // [3, 1, 5, 2, 4]  - random order
 * shuffle([1])              // [1]              - single element unchanged
 * shuffle([])               // []               - empty array unchanged
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    if (i !== j) {
      const tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
    }
  }
  return array;
}
