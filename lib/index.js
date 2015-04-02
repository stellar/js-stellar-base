"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var xdr = _interopRequire(require("./generated/stellar-xdr_generated"));

exports.xdr = xdr;
exports.hash = require("./hashing").hash;

var _signing = require("./signing");

exports.sign = _signing.sign;
exports.verify = _signing.verify;