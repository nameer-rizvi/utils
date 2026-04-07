import * as utils from "../dist/esm/index.js";

console.log(
  ".mjs -->",
  //
  utils.date.isWeekdayName("Monday"),
  utils.date.isWeekdayName("Mon"),
  utils.date.isWeekdayName("mon"),
  utils.date.isWeekdayName("lundi", "fr-FR"),
  utils.date.isWeekdayName("invalid"),
  utils.date.isWeekdayName(""),
  utils.date.isWeekdayName(123),
);
