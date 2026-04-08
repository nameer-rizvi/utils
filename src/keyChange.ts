import * as validate from "./validate.js";
import * as math from "./math.js";

/**
 * Adds computed change metrics to an object in place for a given key name.
 * Mutates the input object by adding `{name}ChangeNum` and `{name}ChangePercent` properties.
 * @example
 * const obj = { price: 100 };
 * keyChange(obj, "price", 100, 150);
 * // obj → { price: 100, priceChangeNum: 50, priceChangePercent: 50 }
 *
 * const obj2 = { revenue: 200 };
 * keyChange(obj2, "revenue", 200, 100);
 * // obj2 → { revenue: 200, revenueChangeNum: -100, revenueChangePercent: -50 }
 */
export function keyChange(
  input: Record<string, unknown>,
  name: string,
  ...args: [number, number]
): void {
  if (validate.isObject(input) && validate.isStringNonEmpty(name)) {
    Object.assign(input, {
      [name + "ChangeNum"]: math.change.num(...args),
      [name + "ChangePercent"]: math.change.percent(...args),
    });
  }
}
