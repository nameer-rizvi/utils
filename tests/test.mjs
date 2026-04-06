import * as utils from "../dist/esm/index.js";

console.log(
  ".mjs -->",
  //
  utils.date.toMysqlDatetime("2024-01-01T12:30:45.000Z"),
  utils.date.toMysqlDatetime(new Date(2024, 0, 1, 12, 30)),
  utils.date.toMysqlDatetime(1704067200000),
  utils.date.toMysqlDatetime(),
);
