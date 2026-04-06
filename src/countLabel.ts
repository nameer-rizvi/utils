import * as validate from "./validate.js";
import { generalCount } from "./generalCount.js";
import pluralize from "pluralize";

export interface CountLabelResult {
  full: string;
  number: string;
  label: string;
}

/**
 * Generates a formatted count label with a pluralized string.
 * @example
 * countLabel(1, "item")              // { full: "1 item",      number: "1",     label: "item" }
 * countLabel(5, "item")              // { full: "5 items",     number: "5",     label: "items" }
 * countLabel(1000, "item")           // { full: "1K items",    number: "1K",    label: "items" }
 * countLabel(1000, "item", true)     // { full: "1,000 items", number: "1,000", label: "items" }
 * countLabel("x", "item")            // { full: "item",        number: "",      label: "item" }
 * countLabel(5, 123)                 // { full: "5",           number: "5",     label: "" }
 */
export function countLabel(
  input: unknown,
  singular: unknown,
  asFullCount = false,
): CountLabelResult {
  let number = "";

  let label = "";

  if (validate.isNumber(input)) {
    number = asFullCount ? input.toLocaleString() : generalCount(input) ?? "0";
  }

  if (validate.isString(singular)) {
    label = validate.isNumber(input) ? pluralize(singular, input) : singular;
  }

  const full = [number, label].filter(Boolean).join(" ");

  return { full, number, label };
}
