import * as math from "./math.js";
import * as validate from "./validate.js";

/**
 * Calculates the Euclidean distance between two numeric vectors.
 * Returns `undefined` if either input is not a valid non-empty number array,
 * or if the arrays differ in length.
 * @see https://en.wikipedia.org/wiki/Euclidean_distance
 * @example
 * euclidean([0, 0], [3, 4])          // 5         - classic 3-4-5 right triangle
 * euclidean([0, 0, 0], [1, 1, 1])    // 1.73      - diagonal distance in 3D unit cube
 * euclidean([1, 2, 3], [1, 2, 3])    // 0         - identical vectors
 * euclidean([1, 2], [1, 2, 3])       // undefined - different lengths
 * euclidean([], [])                  // undefined - empty arrays
 * euclidean("a", [1, 2])             // undefined - not an array
 */
export function euclidean(
  input1: unknown,
  input2: unknown,
): number | undefined {
  const [a, b] = getNormalizedInputs(input1, input2);
  if (!a.length || a.length !== b.length) return;
  let sum = 0;
  for (let i = 0, len = a.length; i < len; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return math.num(Math.sqrt(sum));
}

/**
 * Calculates the Manhattan distance between two numeric vectors.
 * Unlike Euclidean distance, Manhattan distance sums the absolute differences
 * along each dimension rather than computing a straight-line distance.
 * Returns `undefined` if either input is not a valid non-empty number array,
 * or if the arrays differ in length.
 * @see https://en.wikipedia.org/wiki/Manhattan_distance
 * @example
 * manhattan([0, 0], [3, 4])        // 7         - 3+4, vs Euclidean 5
 * manhattan([0, 0, 0], [1, 1, 1])  // 3         - 1+1+1
 * manhattan([1, 2, 3], [1, 2, 3])  // 0         - identical vectors
 * manhattan([1, 2], [1, 2, 3])     // undefined - different lengths
 * manhattan([], [])                // undefined - empty arrays
 * manhattan("a", [1, 2])           // undefined - not an array
 */
export function manhattan(
  input1: unknown,
  input2: unknown,
): number | undefined {
  const [a, b] = getNormalizedInputs(input1, input2);
  if (!a.length || a.length !== b.length) return;
  let sum = 0;
  for (let i = 0, len = a.length; i < len; i++) sum += Math.abs(a[i] - b[i]);
  return math.num(sum);
}

/**
 * Calculates the cosine similarity between two numeric vectors.
 * Returns a value between -1 and 1, where:
 * - `1`  means the vectors point in the same direction
 * - `0`  means the vectors are orthogonal (no similarity)
 * - `-1` means the vectors point in opposite directions
 * Cosine similarity is scale-invariant — magnitude does not affect the result.
 * Returns `undefined` if either input is not a valid non-empty number array,
 * if the arrays differ in length, or if either vector has zero magnitude.
 * @see https://en.wikipedia.org/wiki/Cosine_similarity
 * @example
 * cosine([1, 2, 3], [1, 2, 3])    // 1         - identical vectors, perfect similarity
 * cosine([1, 0], [0, 1])          // 0         - orthogonal vectors, no similarity
 * cosine([1, 2, 3], [3, 2, 1])    // 0.71      - partial similarity
 * cosine([1, 2], [-1, -2])        // -1        - opposite vectors
 * cosine([1, 2], [2, 4])          // 1         - scale-invariant, same direction
 * cosine([1, 2], [1, 2, 3])       // undefined - different lengths
 * cosine([], [])                  // undefined - empty arrays
 */
export function cosine(input1: number[], input2: number[]): number | undefined {
  const [a, b] = getNormalizedInputs(input1, input2);
  if (!a.length || a.length !== b.length) return;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0, len = a.length; i < len; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(magA * magB);
  if (magnitude === 0) return;
  return math.num(dot / magnitude);
}

/**
 * Calculates the Pearson correlation coefficient between two numeric vectors.
 * Returns a value between -1 and 1, where:
 * - `1`  means a perfect positive linear correlation
 * - `0`  means no linear correlation
 * - `-1` means a perfect negative linear correlation
 * Pearson is scale-invariant — magnitude does not affect the result.
 * Returns `undefined` if either input is not a valid non-empty number array,
 * or if the arrays differ in length.
 * Returns `0` if either vector has zero variance (all values are equal).
 * @see https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
 * @example
 * pearson([1, 2, 3], [1, 2, 3])    // 1         - perfect positive correlation
 * pearson([1, 2, 3], [3, 2, 1])    // -1        - perfect negative correlation
 * pearson([1, 2, 3], [2, 4, 6])    // 1         - scale-invariant, same direction
 * pearson([1, 2, 3], [1, 3, 2])    // 0.5       - partial correlation
 * pearson([1, 1, 1], [1, 2, 3])    // 0         - no variance in first vector
 * pearson([1, 2], [1, 2, 3])       // undefined - different lengths
 * pearson([], [])                  // undefined - empty arrays
 */
export function pearson(
  input1: number[],
  input2: number[],
): number | undefined {
  const [a, b] = getNormalizedInputs(input1, input2);
  if (!a.length || a.length !== b.length) return;
  const n = a.length;
  let sum1 = 0;
  let sum2 = 0;
  let sum1Sq = 0;
  let sum2Sq = 0;
  let pSum = 0;
  for (let i = 0; i < n; i++) {
    sum1 += a[i];
    sum2 += b[i];
    sum1Sq += a[i] * a[i];
    sum2Sq += b[i] * b[i];
    pSum += a[i] * b[i];
  }
  const numerator = pSum - (sum1 * sum2) / n;
  const denominator = Math.sqrt(
    (sum1Sq - (sum1 * sum1) / n) * (sum2Sq - (sum2 * sum2) / n),
  );
  if (denominator === 0) return 0;
  return math.num(numerator / denominator);
}

function getNormalizedInputs(
  input1: unknown,
  input2: unknown,
): [number[], number[]] {
  const a: number[] = [];
  const b: number[] = [];
  if (validate.isArray(input1)) {
    for (const n of input1) if (validate.isNumberValid(n)) a.push(n);
  }
  if (validate.isArray(input2)) {
    for (const n of input2) if (validate.isNumberValid(n)) b.push(n);
  }
  return [a, b];
}
