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
