// Patch require to resolve .js imports to .ts files when the .js doesn't exist
const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  try {
    return originalResolveFilename.call(this, request, parent, ...args);
  } catch (err) {
    if (request.endsWith(".js")) {
      return originalResolveFilename.call(
        this,
        request.replace(/\.js$/, ".ts"),
        parent,
        ...args
      );
    }
    throw err;
  }
};

if (typeof window === "undefined") {
  require("ts-node").register({
    project: "tsconfig.cjs.json",
    files: true,
    transpileOnly: true
  });
  global.StellarBase = require("../src/index");
  global.chai = require("chai");
  global.chai.use(require("chai-as-promised"));
  global.sinon = require("sinon");
  global.expect = global.chai.expect;
}
