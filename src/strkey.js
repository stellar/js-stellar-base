import base32 from "base32.js";
import crc from "crc";
import contains from "lodash/includes";
import isUndefined from "lodash/isUndefined";
import isNull from "lodash/isNull";
import isString from "lodash/isString";

const versionBytes = {
  publicKey:  6 << 3, // G
  seed:      18 << 3, // S
  preAuthTx: 19 << 3, // T
  hashX:     23 << 3  // X
};

/**
 * StrKey is a helper class that allows encoding and decoding strkey.
 */
export class StrKey {
  /**
   * Encodes data to strkey public key.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodePublicKey(data) {
    return encodeCheck("publicKey", data);
  }

  /**
   * Decodes strkey public key to raw data.
   * @param {string} data data to decode
   * @returns {Buffer}
   */
  static decodePublicKey(data) {
    return decodeCheck("publicKey", data);
  }

  /**
   * Returns true if the given Stellar public key is valid.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidPublicKey(publicKey) {
    return isValid("publicKey", publicKey);
  }

  /**
   * Encodes data to strkey seed.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeSeed(data) {
    return encodeCheck("seed", data);
  }

  /**
   * Decodes strkey seed to raw data.
   * @param {string} data data to decode
   * @returns {Buffer}
   */
  static decodeSeed(data) {
    return decodeCheck("seed", data);
  }

  /**
   * Returns true if the given Stellar secret key is valid.
   * @param {string} secretKey secretKey to check
   * @returns {boolean}
   */
  static isValidSecretKey(secretKey) {
    return isValid("seed", secretKey);
  }

  /**
   * Encodes data to strkey preAuthTx.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodePreAuthTx(data) {
    return encodeCheck("preAuthTx", data);
  }

  /**
   * Decodes strkey PreAuthTx to raw data.
   * @param {string} data data to decode
   * @returns {Buffer}
   */
  static decodePreAuthTx(data) {
    return decodeCheck("preAuthTx", data);
  }

  /**
   * Encodes data to strkey hashx.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeHashX(data) {
    return encodeCheck("hashX", data);
  }

  /**
   * Decodes strkey hashx to raw data.
   * @param {string} data data to decode
   * @returns {Buffer}
   */
  static decodeHashX(data) {
    return decodeCheck("hashX", data);
  }
}

function isValid(versionByteName, encoded) {
  if (encoded && encoded.length != 56) {
    return false;
  }

  try {
    let decoded = decodeCheck(versionByteName, encoded);
    if (decoded.length !== 32) {
      return false;
    }
  } catch (err) {
    return false;
  }
  return true;
}

export function decodeCheck(versionByteName, encoded) {
  if (!isString(encoded)) {
    throw new TypeError('encoded argument must be of type String');
  }

  let decoded     = base32.decode(encoded);
  let versionByte = decoded[0];
  let payload     = decoded.slice(0, -2);
  let data        = payload.slice(1);
  let checksum    = decoded.slice(-2);

  if (encoded != base32.encode(decoded)) {
    throw new Error('invalid encoded string');
  }

  let expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error(`${versionByteName} is not a valid version byte name.  expected one of "accountId" or "seed"`);
  }

  if (versionByte !== expectedVersion) {
    throw new Error(`invalid version byte. expected ${expectedVersion}, got ${versionByte}`);
  }

  let expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error(`invalid checksum`);
  }

  return new Buffer(data);
}

export function encodeCheck(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error("cannot encode null data");
  }

  let versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error(`${versionByteName} is not a valid version byte name.  expected one of "accountId" or "seed"`);
  }

  data              = new Buffer(data);
  let versionBuffer = new Buffer([versionByte]);
  let payload       = Buffer.concat([versionBuffer, data]);
  let checksum      = calculateChecksum(payload);
  let unencoded     = Buffer.concat([payload, checksum]);

  return base32.encode(unencoded);
}

function calculateChecksum(payload) {
  // This code calculates CRC16-XModem checksum of payload
  // and returns it as Buffer in little-endian order.
  let checksum = new Buffer(2);
  checksum.writeUInt16LE(crc.crc16xmodem(payload), 0);
  return checksum;
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
