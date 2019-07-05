const fs = require("fs");
const path = require("path");
const detective = require("detective");
const resolve = require("resolve").sync;

const ENCODING = "utf-8";
let ID = 0;

const getModuleInfo = filePath => {
  const fileContent = fs.readFileSync(filePath, ENCODING);
  const listAllRequires = detective(fileContent);
  const id = ID++;

  return {
    id,
    filePath,
    fileContent,
    listAllRequires
  };
};

const getAllModulesInfoIntoArray = entry => {
  const rootModuleInfo = getModuleInfo(entry);
  const modulesArray = [rootModuleInfo];

  for (let module of modulesArray) {
    // this is still entry obj
    module.map = {};
    module.listAllRequires.forEach(moduleDep => {
      // ./entryModule1.js
      const baseDir = path.dirname(module.filePath);
      const moduleDepPath = resolve(moduleDep, { baseDir });
      const moduleDepInfo = getModuleInfo(moduleDepPath);
      modulesArray.push(moduleDepInfo);
      module.map[moduleDep] = moduleDepInfo.id;
    });
  }
  return modulesArray;
};

module.exports = { getModuleInfo, getAllModulesInfoIntoArray };
