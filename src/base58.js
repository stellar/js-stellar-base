import {default as bs58} from "./vendor/bs58";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import {hash} from "./hashing";

let nacl = require("tweetnacl");

const versionBytes = {
  "accountId": 0x00, // decimal 0
  "none":      0x01, // decimal 1
  "seed":      0x21, // decimal 33
};

export function decodeBase58(encoded) {
  return new Buffer(bs58.decode(encoded));
}


export function decodeBase58Check(versionByteName, encoded) {
  let decoded     = bs58.decode(encoded);
  let versionByte = decoded[0];
  let payload     = decoded.slice(0, decoded.length - 4);
  let data        = payload.slice(1);
  let checksum    = decoded.slice(decoded.length - 4);

  let expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error(`${versionByteName} is not a valid version byte name.  expected one of "accountId", "seed", or "none"`);
  }

  if (versionByte !== expectedVersion) {
    throw new Error(`invalid version byte.  expected ${expectedVersion}, got ${versionByte}`);
  }

  let expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error(`invalid checksum`);
  }

  if (versionByteName === 'accountId' && decoded.length !== 37) {
    throw new Error(`Decoded address length is invalid. Expected 37, got ${decoded.length}`);
  }

  return new Buffer(data);
}

export function encodeBase58(data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  return bs58.encode(data);
}

export function encodeBase58Check(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  let versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error(`${versionByteName} is not a valid version byte name.  expected one of "accountId", "seed", or "none"`);
  }

  data              = new Buffer(data);
  let versionBuffer = new Buffer([versionByte]);
  let payload       = Buffer.concat([versionBuffer, data]);
  let checksum      = calculateChecksum(payload);
  let unencoded     = Buffer.concat([payload, checksum]);

  return encodeBase58(unencoded);
}

function calculateChecksum(payload) {
  let inner = hash(payload);
  let outer = hash(inner);
  return outer.slice(0,4);
}

function verifyChecksum(expected, actual) {
  if (expected.length !== actual.length) {
    return false;
  }

  if (expected.length === 0) {
    return true;
  }

  for(let i = 0; i < expected.length; i++) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }

  return true;
}
