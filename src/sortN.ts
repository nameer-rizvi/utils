import * as validate from "./validate.js";
import * as math from "./math.js";

const RANGE: [number, number] = [0, 1];

interface SortProp<T> {
  name: keyof T;
  weight?: number;
  reverse?: boolean;
}

interface NormalizedProp<T> {
  name: keyof T;
  weight: number;
  reverse: boolean;
}

/**
 * Sorts an array of objects in place using a weighted multi-property scoring algorithm.
 * Each item receives a normalized score based on the specified properties, weights, and directions.
 * Items are sorted by score descending. A `score` property is added to each item.
 * Mutates the input array in place.
 * @example
 * const items = [{ name: "a", price: 10, rating: 3 }, { name: "b", price: 5, rating: 5 }];
 *
 * sortN(items, "rating")
 * // sorted by rating descending: b (5), a (3)
 *
 * sortN(items, { name: "price", reverse: true }, { name: "rating", weight: 2 })
 * // price reversed (lower is better), rating weighted 2x
 *
 * sortN(items, { name: "price", weight: 1 }, { name: "rating", weight: 3 })
 * // rating weighted 3x more than price
 */
export function sortN<T extends Record<string, unknown>>(
  input: T[],
  ...props: (keyof T | SortProp<T>)[]
): void {
  if (!validate.isArrayNonEmpty(input)) return;

  const normalizedProps: NormalizedProp<T>[] = [];

  for (const prop of props) {
    if (validate.isString(prop)) {
      normalizedProps.push({
        name: prop as keyof T,
        weight: 1,
        reverse: false,
      });
    } else if (validate.isObject(prop) && validate.isString(prop.name)) {
      normalizedProps.push({
        name: prop.name as keyof T,
        weight: validate.isNumberValid(prop.weight) ? prop.weight : 1,
        reverse: prop.reverse === true,
      });
    }
  }

  // Compute min/max stats for each numeric property
  const stats = new Map<keyof T, { min: number; max: number }>();

  for (const { name } of normalizedProps) {
    let min = Infinity;
    let max = -Infinity;
    for (const item of input) {
      const value = item[name];
      if (!validate.isNumberValid(value)) continue;
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (min !== Infinity && max !== -Infinity && max !== min) {
      stats.set(name, { min, max });
    }
  }

  if (!stats.size) return;

  const [rangeMin, rangeMax] = RANGE;

  const targetRange = rangeMax - rangeMin;

  // Compute and assign weighted normalized score to each item
  for (const item of input) {
    let weightedSum = 0;
    let weightTotal = 0;
    for (const { name, weight, reverse } of normalizedProps) {
      const stat = stats.get(name);
      const raw = item[name];
      if (!stat || !validate.isNumberValid(raw)) continue;
      let normalized =
        rangeMin + ((raw - stat.min) / (stat.max - stat.min)) * targetRange;
      if (reverse) normalized = rangeMax - normalized;
      weightedSum += normalized * weight;
      weightTotal += weight;
    }
    const score = weightTotal > 0 ? weightedSum / weightTotal : 0;
    Object.assign(item, { score: math.num(score) });
  }

  // Sort by score descending, items without scores sorted last
  input.sort((a, b) => {
    const scoreA = (a as Record<string, unknown>).score;
    const scoreB = (b as Record<string, unknown>).score;
    if (validate.isNumberValid(scoreA) && validate.isNumberValid(scoreB)) {
      return scoreB - scoreA;
    } else if (validate.isNumberValid(scoreB)) {
      return 1;
    } else if (validate.isNumberValid(scoreA)) {
      return -1;
    } else return 0;
  });
}
