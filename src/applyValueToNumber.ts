import * as validate from "./validate.js";

export type ArithmeticOperator = "+" | "-" | "*" | "**" | "/" | "+%" | "-%";

/**
 * Applies an arithmetic operation to a number using a given value.
 * Returns `input` unchanged if either argument is invalid or the operator is unrecognized.
 * Division by zero is safely handled by returning `input` unchanged.
 * @example
 * applyValueToNumber(10, 5, "+")    // 15
 * applyValueToNumber(10, 5, "-")    // 5
 * applyValueToNumber(10, 5, "*")    // 50
 * applyValueToNumber(10, 2, "**")   // 100
 * applyValueToNumber(10, 2, "/")    // 5
 * applyValueToNumber(10, 0, "/")    // 10  - division by zero returns input
 * applyValueToNumber(100, 10, "+%") // 110 - increase by 10%
 * applyValueToNumber(100, 10, "-%") // 90  - decrease by 10%
 */
export function applyValueToNumber(
  input: number,
  value: number,
  operator: ArithmeticOperator = "+",
): number {
  if (!validate.isNumberValid(input) || !validate.isNumberValid(value)) {
    return input;
  }

  switch (operator) {
    case "+":
      return input + value;
    case "-":
      return input - value;
    case "*":
      return input * value;
    case "**":
      return input ** value;
    case "/":
      return value !== 0 ? input / value : input;
    case "+%":
      return input * (1 + value / 100);
    case "-%":
      return input * (1 - value / 100);
    default:
      return input;
  }
}
