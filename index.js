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
    module.map = {};
    module.listAllRequires.forEach(moduleDep => {
      const baseDir = path.dirname(module.filePath);
      const moduleDepPath = resolve(moduleDep, { baseDir });
      const moduleDepInfo = getModuleInfo(moduleDepPath);
      modulesArray.push(moduleDepInfo);
      module.map[moduleDep] = moduleDepInfo.id;
    });
  }
  return modulesArray;
};

const pack = modules => {
  const moduleSrc = modules
    .map(module => {
      return `${module.id}: {
      factory: (module, require) => {
        ${module.fileContent}
      },
      map: ${JSON.stringify(module.map)}
    }`;
    })
    .join();

  return `(modules => {
    const require = id => {
      const { factory, map } = modules[id]
      const localRequire = name => require(map[name])
      const module = { exports: {} }

      factory(module, localRequire)

      return module.exports
    }

    return require(0)
  })({ ${moduleSrc} })`;
};

module.exports = entry => {
  return pack(getAllModulesInfoIntoArray(entry));
};
