import * as utils from "../dist/esm/index.js";

console.log(
  ".mjs -->",
  //
  utils.date.isDay("2024-01-15", { date: "2024-01-15" }),
  utils.date.isDay("2024-01-16", { date: "2024-01-15", addDays: 1 }),
  utils.date.isDay("2024-02-15", { date: "2024-01-15", addMonths: 1 }),
  utils.date.isDay("2025-01-15", { date: "2024-01-15", addYears: 1 }),
  utils.date.isDay("2024-01-15", { date: "2024-01-16" }),
  utils.date.isDay(),
);
