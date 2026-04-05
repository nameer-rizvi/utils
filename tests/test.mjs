import * as utils from "../dist/esm/index.js";

console.log(
  ".mjs -->",
  utils.applyValueToNumber(10, 5, "+"),
  utils.applyValueToNumber(10, 5, "-"),
  utils.applyValueToNumber(10, 5, "*"),
  utils.applyValueToNumber(10, 2, "**"),
  utils.applyValueToNumber(10, 2, "/"),
  utils.applyValueToNumber(10, 0, "/"),
  utils.applyValueToNumber(100, 10, "+%"),
  utils.applyValueToNumber(100, 10, "-%"),
);
