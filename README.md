# Derping 

Short for DEpendency Resolution and PackING

A simplified version of package bundler

Inspired by [minipack](https://github.com/ronami/minipack) and [wbpck-bundler](https://github.com/adamisntdead/wbpck-bundler) 💡

# Usage

By running `node ./test.js`, you'll get a log of bundled file. Copy paste these into browser console to see results. 

The idea behind bundler is to allow developer to use [CJS](https://requirejs.org/docs/commonjs.html)' `module.exports` and `require` syntax and have a working frontend code (browsers do not recognize CJS syntax)

```
(modules => {
    const require = id => {
      const { factory, map } = modules[id]
      const localRequire = name => require(map[name])
      const module = { exports: {} }

      factory(module, localRequire)

      return module.exports
    }

    return require(0)
  })({ 0: {
      factory: (module, require) => {
        const entryModule1 = require("./entryModule1.js");

const result = Math.random()
  .toString(36)
  .substring(2, 15);

entryModule1();
console.log("result is: ", result);

      },
      map: {"./entryModule1.js":1}
    },1: {
      factory: (module, require) => {
        const entryModule2 = require("./entryModule2.js");

const entryModule1Func = () => {
  console.log("hello from entryModule1!");
  entryModule2();
};

module.exports = entryModule1Func;

      },
      map: {"./entryModule2.js":2}
    },2: {
      factory: (module, require) => {
        const entryModule2Func = () => {
  console.log("Hello from entrymodule2!");
};

module.exports = entryModule2Func;

      },
      map: {}
    } })
```
