const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  utils.applyValueToNumber(10, 5, "+"),
  utils.applyValueToNumber(10, 5, "-"),
  utils.applyValueToNumber(10, 5, "*"),
  utils.applyValueToNumber(10, 2, "**"),
  utils.applyValueToNumber(10, 2, "/"),
  utils.applyValueToNumber(10, 0, "/"),
  utils.applyValueToNumber(100, 10, "+%"),
  utils.applyValueToNumber(100, 10, "-%"),
);
