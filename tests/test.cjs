const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  utils.jwt.encode(123),
  utils.jwt.encode("test"),
  utils.jwt.encode([1, 2, 3]),
  utils.jwt.decode(utils.jwt.encode(123)),
  utils.jwt.decodeJson(utils.jwt.encode([1, 2, 3])),
);
