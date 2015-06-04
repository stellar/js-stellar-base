"use strict";

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

exports.decodeBase58 = decodeBase58;
exports.decodeBase58Check = decodeBase58Check;
exports.encodeBase58 = encodeBase58;
exports.encodeBase58Check = encodeBase58Check;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var bs58 = _interopRequire(require("./vendor/bs58"));

var _lodash = require("lodash");

var isUndefined = _lodash.isUndefined;
var isNull = _lodash.isNull;

var hash = require("./hashing").hash;

var nacl = require("tweetnacl");

var versionBytes = {
  accountId: 0, // decimal 0
  none: 1, // decimal 1
  seed: 33 };

function decodeBase58(encoded) {
  return new Buffer(bs58.decode(encoded));
}

function decodeBase58Check(versionByteName, encoded) {
  var decoded = bs58.decode(encoded);
  var versionByte = decoded[0];
  var payload = decoded.slice(0, decoded.length - 4);
  var data = payload.slice(1);
  var checksum = decoded.slice(decoded.length - 4);

  var expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\", \"seed\", or \"none\"");
  }

  if (versionByte !== expectedVersion) {
    throw new Error("invalid version byte.  expected " + expectedVersion + ", got " + versionByte);
  }

  var expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error("invalid checksum");
  }

  if (versionByteName === "accountId" && decoded.length !== 37) {
    throw new Error("Decoded address length is invalid. Expected 37, got " + decoded.length);
  }

  return new Buffer(data);
}

function encodeBase58(data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  return bs58.encode(data);
}

function encodeBase58Check(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  var versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\", \"seed\", or \"none\"");
  }

  data = new Buffer(data);
  var versionBuffer = new Buffer([versionByte]);
  var payload = Buffer.concat([versionBuffer, data]);
  var checksum = calculateChecksum(payload);
  var unencoded = Buffer.concat([payload, checksum]);

  return encodeBase58(unencoded);
}

function calculateChecksum(payload) {
  var inner = hash(payload);
  var outer = hash(inner);
  return outer.slice(0, 4);
}

function verifyChecksum(expected, actual) {
  if (expected.length !== actual.length) {
    return false;
  }

  if (expected.length === 0) {
    return true;
  }

  for (var i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }

  return true;
}
// decimal 33