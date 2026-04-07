const utils = require("../dist/cjs/index.js");

console.log(
  ".cjs -->",
  //
  utils.date.isWeekdayName("Monday"),
  utils.date.isWeekdayName("Mon"),
  utils.date.isWeekdayName("mon"),
  utils.date.isWeekdayName("lundi", "fr-FR"),
  utils.date.isWeekdayName("invalid"),
  utils.date.isWeekdayName(""),
  utils.date.isWeekdayName(123),
);
