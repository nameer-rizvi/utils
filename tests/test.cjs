const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  utils.changecase.pascalSnakeCase("this is a test"),
  utils.isStringSafeRegex("hello"),
  utils.isStringSafeRegex("(a+)+"),
  utils.isStringSafeRegex(123),
);
