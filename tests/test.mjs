import * as utils from "../dist/esm/index.js";

console.log(
  ".mjs -->",
  utils.changecase.pascalSnakeCase("this is a test"),
  utils.isStringSafeRegex("hello"),
  utils.isStringSafeRegex("(a+)+"),
  utils.isStringSafeRegex(123),
);
