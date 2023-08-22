module.exports = {
  env: {
    mocha: true
  },
  parser: "@babel/eslint-parser",
  plugins: ["@babel", "prettier", "prefer-import"],
  globals: {
    StellarBase: true,
    chai: true,
    sinon: true,
    expect: true
  },
  rules: {
    "no-unused-vars": 0
  }
};
