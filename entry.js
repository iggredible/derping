const entryModule1 = require("./entryModule1.js");

const result = Math.random()
  .toString(36)
  .substring(2, 15);

entryModule1();
console.log("result is: ", result);
