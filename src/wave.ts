import * as validate from "./validate.js";
import * as math from "./math.js";

interface WaveResult {
  index: number;
  value: number;
  range: [number, number];
  trend: [-1 | 0 | 1, -1 | 0 | 1];
  changeNum: [number, number];
  changePerc: [number, number];
  gapNum: number;
  gapPerc: number;
}

/**
 * Analyzes a numeric array and returns wave-style trend metrics for each data point.
 * Tracks rolling low/high extrema and computes change metrics relative to each.
 * - `range`     → [current low, current high]
 * - `trend`     → [overall direction, current extrema direction] (-1 = down, 0 = neutral, 1 = up)
 * - `changeNum` → [change from low, change from high]
 * - `changePerc`→ [% change from low, % change from high]
 * - `gapNum`    → absolute difference between low and high
 * - `gapPerc`   → % difference between low and high
 * @example
 * wave([10, 20, 15, 25, 5])
 * // [
 * //   { index: 0, value: 10, range: [10, 10], trend: [0, 0], ... },
 * //   { index: 1, value: 20, range: [10, 20], trend: [1, 1], ... },
 * //   { index: 2, value: 15, range: [15, 20], trend: [1, 0], ... },
 * //   ...
 * // ]
 *
 * wave([])   // []
 * wave([42]) // [{ index: 0, value: 42, range: [42, 42], trend: [0, 0], ... }]
 */
export function wave(array: number[]): WaveResult[] {
  if (!validate.isArrayNonEmpty(array)) return [];

  const results = new Array(array.length) as WaveResult[];

  let low = array[0];

  let high = array[0];

  let trendDir: -1 | 0 | 1 = 0;

  let extrema: -1 | 0 | 1 = 0;

  for (let i = 0; i < array.length; i++) {
    const value = array[i];

    if (extrema === 0) {
      if (value > high) {
        extrema = 1;
        trendDir = 1;
        high = value;
      } else if (value < low) {
        extrema = -1;
        trendDir = -1;
        low = value;
      }
    } else if (extrema === 1) {
      if (value > high) {
        high = value;
      } else if (value < high) {
        low = value;
        extrema = 0;
      }
    } else {
      if (value < low) {
        low = value;
      } else if (value > low) {
        high = value;
        extrema = 0;
      }
    }

    results[i] = {
      index: i,
      value,
      range: [low, high],
      trend: [trendDir, extrema],
      changeNum: [
        math.change.num(low, value) ?? 0,
        math.change.num(high, value) ?? 0,
      ],
      changePerc: [
        math.change.percent(low, value) ?? 0,
        math.change.percent(high, value) ?? 0,
      ],
      gapNum: math.change.num(low, high) ?? 0,
      gapPerc: math.change.percent(low, high) ?? 0,
    };
  }

  return results;
}
