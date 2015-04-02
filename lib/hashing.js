"use strict";

exports.hash = hash;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var sha256 = require("sha.js").sha256;

function hash(data) {
  var hasher = new sha256();
  hasher.update(data, "utf8");
  return hasher.digest();
}