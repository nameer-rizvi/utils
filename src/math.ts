import * as validate from "./validate.js";

/**
 * Calculates the change between two numbers (`input2 - input1`),
 * rounded to an appropriate number of decimal places based on magnitude.
 * Returns `undefined` if either input is not a valid finite number.
 * @example
 *  change.num(10, 20)        // 10
 *  change.num(0.001, 0.002)  // 0.001
 *  change.num(100, 50)       // -50
 *  change.num(NaN, 10)       // undefined
 *  change.num("10", 20)      // undefined - not a number
 */
function changeNum(input1: unknown, input2: unknown): number | undefined {
  if (validate.isNumberValid(input1) && validate.isNumberValid(input2)) {
    return num(input2 - input1);
  }
}

/**
 * Calculates the percentage change from one number to another (`(input2 - input1) / input1 * 100`),
 * rounded to an appropriate number of decimal places based on magnitude.
 * Returns `undefined` if either input is not a valid finite number, or if `input1` is zero
 * (division by zero).
 * @example
 * change.percent(100, 150)   // 50        - 50% increase
 * change.percent(100, 50)    // -50       - 50% decrease
 * change.percent(0.5, 0.75)  // 50        - 50% increase
 * change.percent(0, 100)     // undefined - division by zero
 * change.percent(NaN, 100)   // undefined - invalid input
 * change.percent("10", 20)   // undefined - not a number
 */
function changePercent(input1: unknown, input2: unknown): number | undefined {
  if (input1 === 0) return;
  if (validate.isNumberValid(input1) && validate.isNumberValid(input2)) {
    return num(((input2 - input1) / input1) * 100);
  }
}

export type ChangeSymbolType = [
  1 | -1 | 0, // numeric direction
  "up" | "down" | "neutral", // label
  "+" | "-" | "•", // sign
  "↑" | "↓" | "•", // arrow
  "🟢" | "🔴" | "⚪", // emoji
];

/**
 * Returns a tuple of symbols representing the direction of change from one number to another.
 * Returns `undefined` if either input is not a valid finite number.
 * @example
 * change.symbol(10, 20)   // [1,  "up",      "+", "↑", "🟢"]
 * change.symbol(20, 10)   // [-1, "down",    "-", "↓", "🔴"]
 * change.symbol(10, 10)   // [0,  "neutral", "•", "•", "⚪"]
 * change.symbol(NaN, 10)  // undefined
 * change.symbol("10", 20) // undefined - not a number
 */
function changeSymbol(
  input1: unknown,
  input2: unknown,
): ChangeSymbolType | undefined {
  if (validate.isNumberValid(input1) && validate.isNumberValid(input2)) {
    if (input2 > input1) return [1, "up", "+", "↑", "🟢"];
    if (input2 < input1) return [-1, "down", "-", "↓", "🔴"];
    if (input2 === input1) return [0, "neutral", "•", "•", "⚪"];
  }
}

export const change = {
  num: changeNum,
  percent: changePercent,
  symbol: changeSymbol,
};

/**
 * Calculates the absolute difference (discrepancy) between two numbers,
 * rounded to an appropriate number of decimal places based on magnitude.
 * Returns `undefined` if either input is not a valid finite number.
 * @example
 * discrepancy(10, 20)    // 10        - order doesn't matter
 * discrepancy(20, 10)    // 10        - same result
 * discrepancy(0.1, 0.3)  // 0.2
 * discrepancy(NaN, 10)   // undefined
 * discrepancy("10", 20)  // undefined - not a number
 */
export function discrepancy(
  input1: unknown,
  input2: unknown,
): number | undefined {
  if (validate.isNumberValid(input1) && validate.isNumberValid(input2)) {
    return num(Math.abs(input2 - input1));
  }
}

/**
 * Calculates the efficiency of a path as a percentage.
 * Efficiency is the ratio of the straight-line distance (first to last value)
 * to the total journey distance (sum of all step-by-step changes).
 * A score of 100% means the path was perfectly straight with no backtracking.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `0` if fewer than 2 valid numbers are provided, or if there is no net movement.
 * Returns `undefined` if rounding fails.
 * @example
 * efficiency(0, 5, 10)       // 100   - straight path, no backtracking
 * efficiency(0, 10, 5, 10)   // 50    - backtracked halfway
 * efficiency(0, 0, 0)        // 0     - no movement
 * efficiency([0, 5, 10])     // 100   - array input
 * efficiency(10)             // 0     - fewer than 2 valid numbers
 */
export function efficiency(
  ...args: unknown[] | [unknown[]]
): number | undefined {
  const numbers: number[] = [];
  for (const n of args.flat()) if (validate.isNumberValid(n)) numbers.push(n);
  if (numbers.length < 2) return 0;
  const distance = Math.abs(numbers[numbers.length - 1] - numbers[0]);
  if (distance === 0) return 0;
  let journey = 0;
  for (let i = 1; i < numbers.length; i++) {
    journey += Math.abs(numbers[i] - numbers[i - 1]);
  }
  if (journey === 0) return 0;
  return num((distance / journey) * 100);
}

/**
 * Calculates the Compound Growth Rate (CGR) from one value to another over a number of periods.
 * Returns `undefined` if either input is not a valid finite number, if `input1` or `periods` is zero,
 * or if the ratio of `input2 / input1` is negative (which would result in a complex number).
 * @example
 * growthRate(100, 200, 3)   // 26        - ~26% growth per period over 3 periods
 * growthRate(100, 50, 2)    // -29.29    - ~29% decline per period over 2 periods
 * growthRate(100, 200)      // 100       - 100% growth over 1 period (default)
 * growthRate(0, 100)        // undefined - division by zero
 * growthRate(100, 0, 0)     // undefined - zero periods
 * growthRate(-100, 100, 2)  // undefined - negative ratio produces complex number
 */
export function growthRate(
  input1: unknown,
  input2: unknown,
  periods = 1,
): number | undefined {
  if (
    validate.isNumberValid(input1) &&
    validate.isNumberValid(input2) &&
    validate.isNumberValid(periods)
  ) {
    if (input1 === 0 || periods <= 0) return;
    const ratio = input2 / input1;
    if (ratio < 0) return;
    return num((Math.pow(ratio, 1 / periods) - 1) * 100);
  }
}

/**
 * Calculates the arithmetic mean (average) of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `undefined` if no valid numbers are provided.
 * @example
 * mean(1, 2, 3, 4, 5)        // 3
 * mean([1, 2, 3, 4, 5])      // 3         - array input
 * mean(1, 2, "three", 4, 5)  // 3         - non-numeric values ignored
 * mean(1.5, 2.5)             // 2
 * mean()                     // undefined - no valid numbers
 * mean("a", "b")             // undefined - no valid numbers
 */
export function mean(...args: unknown[] | [unknown[]]): number | undefined {
  let total = 0;
  let count = 0;
  for (const n of args.flat()) {
    if (validate.isNumberValid(n)) {
      total += n;
      count++;
    }
  }
  return count > 0 ? num(total / count) : undefined;
}

/**
 * Calculates the median of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * For an even count of numbers, returns the mean of the two middle values.
 * Returns `undefined` if no valid numbers are provided.
 * @example
 * median(1, 2, 3, 4, 5)        // 3         - odd count, middle value
 * median(1, 2, 3, 4)           // 2.5       - even count, mean of middle two
 * median([1, 2, 3, 4, 5])      // 3         - array input
 * median(1, 2, "three", 4, 5)  // 3         - non-numeric values ignored
 * median()                     // undefined - no valid numbers
 * median("a", "b")             // undefined - no valid numbers
 */
export function median(...args: unknown[] | [unknown[]]): number | undefined {
  const numbers: number[] = [];
  for (const n of args.flat()) if (validate.isNumberValid(n)) numbers.push(n);
  if (numbers.length === 0) return;
  numbers.sort((a, b) => a - b);
  const middle = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    return num((numbers[middle - 1] + numbers[middle]) / 2);
  } else {
    return num(numbers[middle]);
  }
}

/**
 * Calculates the mode (most frequently occurring value) of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * If multiple values share the highest frequency, the first one encountered is returned.
 * Returns `undefined` if no valid numbers are provided.
 * @example
 * mode(1, 2, 2, 3, 3, 3)      // 3         - 3 appears most frequently
 * mode([1, 2, 2, 3, 3, 3])    // 3         - array input
 * mode(1, 2, "three", 2, 3)   // 2         - non-numeric values ignored
 * mode(0, 0, 1, 2)            // 0         - correctly handles 0 as mode
 * mode()                      // undefined - no valid numbers
 * mode("a", "b")              // undefined - no valid numbers
 */
export function mode(...args: unknown[] | [unknown[]]): number | undefined {
  const freq: Record<number, number> = {};
  for (const n of args.flat()) {
    if (validate.isNumberValid(n)) freq[n] = (freq[n] ?? 0) + 1;
  }
  const top = +Object.keys(freq).sort((a, b) => freq[+b] - freq[+a])[0];
  if (validate.isNumberValid(top)) return top;
}

/**
 * Normalizes an array of numbers to a 0–1 scale based on the min and max values.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * If all values are equal (range is zero), all values are normalized to `1`.
 * Returns `undefined` if no valid numbers are provided.
 * @example
 * normalize(0, 5, 10)          // [0, 0.5, 1]   - normalized to 0-1 scale
 * normalize([0, 5, 10])        // [0, 0.5, 1]   - array input
 * normalize(5, 5, 5)           // [1, 1, 1]     - all equal, range is zero
 * normalize(1, "a", 2, "b", 3) // [0, 0.5, 1]   - non-numeric values ignored
 * normalize()                  // undefined     - no valid numbers
 */
export function normalize(
  ...args: unknown[] | [unknown[]]
): number[] | undefined {
  const numbers: number[] = [];
  for (const n of args.flat()) if (validate.isNumberValid(n)) numbers.push(n);
  if (numbers.length === 0) return;
  let min = numbers[0];
  let max = numbers[0];
  for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  const range = max - min;
  const normalized: number[] = [];
  for (const n of numbers) {
    if (range === 0) {
      normalized.push(1);
    } else {
      normalized.push(num((n - min) / range) ?? (n - min) / range);
    }
  }
  return normalized;
}

/**
 * Rounds a number to an appropriate number of decimal places based on its magnitude.
 * - Zero → `0`
 * - 1,000 and above → rounded to nearest integer
 * - 1 to 999.99 → rounded to 2 decimal places
 * - Below 1 → rounded to enough significant figures to show at least 2 non-zero digits
 * Returns `undefined` if the input is not a valid finite number.
 * @example
 * num(1234.5678)   // 1235       - large number, nearest integer
 * num(12.3456)     // 12.35      - medium number, 2 decimal places
 * num(0.00123456)  // 0.00123    - small number, significant figures preserved
 * num(0)           // 0
 * num(NaN)         // undefined
 * num("123")       // undefined  - not a number
 */
export function num(input: unknown): number | undefined {
  if (!validate.isNumberValid(input)) return;
  const abs = Math.abs(input);
  if (abs === 0) return 0;
  if (abs >= 1000) return Math.round(input);
  if (abs >= 1) return +input.toFixed(2);
  const decimals = Math.max(3, -Math.floor(Math.log10(abs)) + 2);
  return +input.toFixed(decimals);
}

/**
 * Calculates what percentage `input1` is of `input2`.
 * Returns `undefined` if either input is not a valid finite number, or if `input2` is zero
 * (division by zero).
 * @example
 * percent(50, 200)   // 25        - 50 is 25% of 200
 * percent(1, 3)      // 33.33     - rounded to 2 decimal places
 * percent(200, 100)  // 200       - over 100% is valid
 * percent(0, 100)    // 0         - 0 is 0% of anything
 * percent(50, 0)     // undefined - division by zero
 * percent("50", 100) // undefined - not a number
 */
export function percent(input1: unknown, input2: unknown): number | undefined {
  if (validate.isNumberValid(input1) && validate.isNumberValid(input2)) {
    if (input2 === 0) return;
    return num((input1 / input2) * 100);
  }
}

/**
 * Calculates the population standard deviation of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `0` if fewer than 2 valid numbers are provided.
 * Returns `undefined` if rounding fails.
 * @example
 * standardDeviation(2, 4, 4, 4, 5, 5, 7, 9)   // 2       - population std dev
 * standardDeviation([2, 4, 4, 4, 5, 5, 7, 9]) // 2       - array input
 * standardDeviation(1, "a", 2, "b", 3)        // 0.82    - non-numeric values ignored
 * standardDeviation(5)                        // 0       - fewer than 2 values
 * standardDeviation()                         // 0       - no valid numbers
 */
export function standardDeviation(
  ...args: unknown[] | [unknown[]]
): number | undefined {
  const varValue = variance(...args);
  if (varValue === undefined) return;
  return num(Math.sqrt(varValue));
}

/**
 * Calculates the sum of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `undefined` if rounding fails.
 * @example
 * sum(1, 2, 3, 4, 5)        // 15
 * sum([1, 2, 3, 4, 5])      // 15     - array input
 * sum(1, 2, "three", 4, 5)  // 12     - non-numeric values ignored
 * sum(0.1, 0.2)             // 0.3    - floating point handled via rounding
 * sum()                     // 0
 * sum("a", "b")             // 0
 */
export function sum(...args: unknown[] | [unknown[]]): number | undefined {
  let total = 0;
  for (const n of args.flat()) if (validate.isNumberValid(n)) total += n;
  return num(total);
}

/**
 * Calculates the slope of the linear trend line through a sequence of numbers
 * using the least-squares regression method.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `0` if fewer than 2 valid numbers are provided, or if all values are equal (no trend).
 * Returns `undefined` if rounding fails.
 * @example
 * trendSlope(1, 2, 3, 4, 5)       // 1      - perfect upward trend
 * trendSlope(5, 4, 3, 2, 1)       // -1     - perfect downward trend
 * trendSlope([1, 2, 3, 4, 5])     // 1      - array input
 * trendSlope(3, 3, 3, 3)          // 0      - no trend, flat line
 * trendSlope(1, 3, 2, 4, 3, 5)    // 0.629  - noisy upward trend
 * trendSlope(5)                   // 0      - fewer than 2 values
 */
export function trendSlope(
  ...args: unknown[] | [unknown[]]
): number | undefined {
  const numbers: number[] = [];
  for (const n of args.flat()) if (validate.isNumberValid(n)) numbers.push(n);
  const n = numbers.length;
  if (n < 2) return 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += numbers[i];
    sumXY += i * numbers[i];
    sumX2 += i * i;
  }
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return 0;
  return num((n * sumXY - sumX * sumY) / denominator);
}

/**
 * Calculates the population variance of a set of numbers.
 * Non-numeric values are ignored.
 * Accepts either individual numbers or a single array of numbers.
 * Returns `0` if fewer than 2 valid numbers are provided.
 * Returns `undefined` if rounding fails.
 * @example
 * variance(2, 4, 4, 4, 5, 5, 7, 9)   // 4       - population variance
 * variance([2, 4, 4, 4, 5, 5, 7, 9]) // 4       - array input
 * variance(1, "a", 2, "b", 3)        // 0.67    - non-numeric values ignored
 * variance(5)                        // 0       - fewer than 2 values
 * variance()                         // 0       - no valid numbers
 */
export function variance(...args: unknown[] | [unknown[]]): number | undefined {
  let sum = 0;
  let count = 0;
  const numbers: number[] = [];
  for (const n of args.flat()) {
    if (validate.isNumberValid(n)) {
      sum += n;
      count++;
      numbers.push(n);
    }
  }
  if (count < 2) return 0;
  let sqDiffSum = 0;
  for (const n of numbers) sqDiffSum += (n - sum / count) * (n - sum / count);
  return num(sqDiffSum / count);
}

/**
 * Calculates the z-score of a value relative to a dataset.
 * The z-score represents how many standard deviations the value is from the mean.
 * Non-numeric values in the dataset are ignored.
 * Returns `0` if the standard deviation is zero (all values are equal).
 * Returns `undefined` if `value` is not a valid number, or if the dataset has fewer than 2 valid numbers.
 * @example
 * zscore(5, 2, 4, 4, 4, 5, 5, 7, 9)  // 0       - 0.5 std devs above mean
 * zscore(2, 2, 4, 4, 4, 5, 5, 7, 9)  // -1.5      - 1.5 std devs below mean
 * zscore(4, 4, 4, 4)                 // 0         - no spread, std dev is zero
 * zscore(NaN, 1, 2, 3)               // undefined - invalid value
 * zscore(5, 1)                       // undefined - dataset too small
 * // Detecting outliers (|z| > 2 is a common threshold)
 * const scores = [72, 85, 90, 88, 76, 95, 68, 100, 55, 91];
 * zscore(55, ...scores)              // -2.04     - low but within normal range
 * zscore(100, ...scores)             // 1.36      - high but within normal range
 * // Comparing values across different scales
 * const temps = [20, 22, 21, 23, 19, 24, 20, 22];    // temperature dataset
 * const sales = [100, 150, 120, 180, 90, 200, 110];  // sales dataset
 * zscore(24, ...temps)               // 1.67     - 1.38 std devs above average temp
 * zscore(200, ...sales)              // 1.65     - 1.55 std devs above average sales
 */
export function zscore(
  value: number,
  ...args: unknown[] | [unknown[]]
): number | undefined {
  if (!validate.isNumberValid(value)) return;
  const numbers: number[] = [];
  for (const n of args.flat()) if (validate.isNumberValid(n)) numbers.push(n);
  if (numbers.length < 2) return;
  const meanValue = mean(numbers);
  const stdDev = standardDeviation(numbers);
  if (meanValue === undefined || stdDev === undefined) return;
  if (stdDev === 0) return 0;
  return num((value - meanValue) / stdDev);
}
