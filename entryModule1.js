const entryModule2 = require("./entryModule2.js");

const entryModule1Func = () => {
  console.log("hello from entryModule1!");
  entryModule2();
};

module.exports = entryModule1Func;
