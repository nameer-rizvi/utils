import * as date from "./date.js";
import * as validate from "./validate.js";
import * as math from "./math.js";

interface Options {
  multiplier?: number;
  initialValue?: number;
  startDate?: date.DateType;
  endDate?: date.DateType;
  baselineInitialValue?: number;
  baselineFinalValue?: number;
}

interface Result {
  initialValue: number;
  finalValue: number;
  changeNum?: number;
  changePercent?: number;
  changeRate?: number;
  changeSymbol?: math.ChangeSymbolType;
  periods: number;
  positives: number;
  negatives: number;
  neutrals: number;
  positive?: number;
  negative?: number;
  neutral?: number;
  mean?: number;
  median?: number;
  mode?: number;
  min?: number;
  max?: number;
  standardDeviation?: number;
  variance?: number;
  slope?: number;
  efficiency?: number;
  startDate?: Date;
  endDate?: Date;
  years?: number;
  annualized?: number;
  baselineInitialValue?: number;
  baselineFinalValue?: number;
  baselineChangeNum?: number;
  baselineChangePercent?: number;
  baselineChangeRate?: number;
  baselineChangeAnnualized?: number;
  baselineChangeSymbol?: math.ChangeSymbolType;
  baselineCompare?: number;
}

/**
 * Evaluates a series of percentage deltas and returns a comprehensive statistical result.
 * Optionally compares against a baseline and computes annualized metrics if dates are provided.
 * @example
 * evaluateSeries([5, -3, 8, 2, -1])
 * // { initialValue: 100, finalValue: 111.84, changePercent: 11.84, ... }
 *
 * evaluateSeries([5, -3, 8], { initialValue: 1000, multiplier: 2 })
 * // Doubles each delta before applying
 *
 * evaluateSeries([5, -3, 8], {
 *   startDate: "2020-01-01",
 *   endDate: "2024-01-01",
 *   baselineInitialValue: 100,
 *   baselineFinalValue: 150,
 * })
 * // Includes annualized metrics and baseline comparison
 */
export function evaluateSeries(input: unknown, option: Options = {}): Result {
  const multiplier = option.multiplier || 1;

  const initialValue = option.initialValue || 100;

  const deltas: number[] = [];

  if (validate.isArray(input)) {
    for (const i of input) {
      if (validate.isNumberValid(i)) deltas.push(i * multiplier);
    }
  }

  const finalValue = deltas.reduce((r, n) => r + r * (n / 100), initialValue);

  const changeNum = math.change.num(initialValue, finalValue);

  const changePercent = math.change.percent(initialValue, finalValue);

  const changeRate = math.growthRate(initialValue, finalValue, deltas.length);

  const changeSymbol = math.change.symbol(initialValue, finalValue);

  const periods = deltas.length;

  const positives = deltas.filter((i) => i > 0).length;

  const negatives = deltas.filter((i) => i < 0).length;

  const neutrals = deltas.filter((i) => i === 0).length;

  const positive = math.percent(positives, periods);

  const negative = math.percent(negatives, periods);

  const neutral = math.percent(neutrals, periods);

  const mean = math.mean(deltas);

  const median = math.median(deltas);

  const mode = math.mode(deltas.map(Math.round));

  // Safe min/max without spread to avoid stack overflow on large arrays
  let min = Infinity;
  let max = -Infinity;
  for (const d of deltas) {
    if (d < min) min = d;
    if (d > max) max = d;
  }

  const standardDeviation = math.standardDeviation(deltas);

  const variance = math.variance(deltas);

  const slope = math.trendSlope(deltas);

  const efficiency = math.efficiency(deltas);

  const result: Result = {
    initialValue,
    finalValue: math.num(finalValue)!,
    changeNum,
    changePercent,
    changeRate,
    changeSymbol,
    periods,
    positives,
    negatives,
    neutrals,
    positive,
    negative,
    neutral,
    mean,
    median,
    mode,
    min,
    max,
    standardDeviation,
    variance,
    slope,
    efficiency,
  };

  if (validate.isDate(option.startDate)) {
    const startDate = new Date(option.startDate);

    const endDate = date.resolve(option.endDate);

    const diff = endDate.getTime() - startDate.getTime();

    const years = Math.round(diff / date.MS_PER_DAY) / 365;

    const annualized = math.growthRate(initialValue, finalValue, years);

    Object.assign(result, {
      startDate,
      endDate,
      years: math.num(years),
      annualized,
    });

    if (
      validate.isNumberValid(option.baselineInitialValue) &&
      validate.isNumberValid(option.baselineFinalValue)
    ) {
      const { baselineInitialValue, baselineFinalValue } = option;

      const baselineChangeNum = math.change.num(
        baselineInitialValue,
        baselineFinalValue,
      );

      const baselineChangePercent = math.change.percent(
        baselineInitialValue,
        baselineFinalValue,
      );

      const baselineChangeRate = math.growthRate(
        baselineInitialValue,
        baselineFinalValue,
        deltas.length,
      );

      const baselineChangeAnnualized = math.growthRate(
        baselineInitialValue,
        baselineFinalValue,
        years,
      );

      const baselineChangeSymbol = math.change.symbol(
        baselineInitialValue,
        baselineFinalValue,
      );

      const baselineCompare =
        annualized !== undefined &&
        annualized > 0 &&
        baselineChangeAnnualized !== undefined &&
        baselineChangeAnnualized > 0
          ? math.num(annualized / baselineChangeAnnualized)
          : annualized !== undefined && annualized > 0
          ? 2
          : -1;

      Object.assign(result, {
        baselineInitialValue,
        baselineFinalValue,
        baselineChangeNum,
        baselineChangePercent,
        baselineChangeRate,
        baselineChangeAnnualized,
        baselineChangeSymbol,
        baselineCompare,
      });
    }
  }

  return result;
}
