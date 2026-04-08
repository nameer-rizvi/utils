const utils = require("../dist/cjs/index.js");

const obj = { price: 100 };
utils.keyChange(obj, "price", 100, 150);
const obj2 = { revenue: 200 };
utils.keyChange(obj2, "revenue", 200, 100);

console.log(
  ".cjs -->",
  //
  obj,
  obj2,
);
