const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  utils.countLabel(1, "item"),
  utils.countLabel(5, "item"),
  utils.countLabel(1000, "item"),
  utils.countLabel(1000, "item", true),
  utils.countLabel("x", "item"),
  utils.countLabel(5, 123),
);
