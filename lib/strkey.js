"use strict";

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

exports.decodeCheck = decodeCheck;
exports.encodeCheck = encodeCheck;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var base32 = _interopRequire(require("thirty-two"));

var crc = _interopRequire(require("crc"));

var _lodash = require("lodash");

var isUndefined = _lodash.isUndefined;
var isNull = _lodash.isNull;

var versionBytes = {
  accountId: 48,
  seed: 144
};

function decodeCheck(versionByteName, encoded) {
  var decoded = base32.decode(encoded);
  var versionByte = decoded[0];
  var payload = decoded.slice(0, -2);
  var data = payload.slice(1);
  var checksum = decoded.slice(-2);

  var expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\" or \"seed\"");
  }

  if (versionByte !== expectedVersion) {
    throw new Error("invalid version byte. expected " + expectedVersion + ", got " + versionByte);
  }

  var expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error("invalid checksum");
  }

  if (versionByteName === "accountId" && decoded.length !== 35) {
    throw new Error("Decoded address length is invalid. Expected 35, got " + decoded.length);
  }

  return new Buffer(data);
}

function encodeCheck(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  var versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error("" + versionByteName + " is not a valid version byte name.  expected one of \"accountId\" or \"seed\"");
  }

  data = new Buffer(data);
  var versionBuffer = new Buffer([versionByte]);
  var payload = Buffer.concat([versionBuffer, data]);
  var checksum = calculateChecksum(payload);
  var unencoded = Buffer.concat([payload, checksum]);

  return base32.encode(unencoded).toString(); //.replace(/=/g, '');
}

function calculateChecksum(payload) {
  var checksum = ("0000" + crc.crc16xmodem(payload).toString(16)).slice(-4); // Padding to 2 bytes
  return new Buffer(checksum.match(/.{2}/g).reverse().join(""), "hex"); // Little-endian
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