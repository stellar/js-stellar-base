/* eslint no-bitwise: ["error", {"allow": ["<<", ">>", "^", "&", "&="]}] */

import base32 from 'base32.js';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import isString from 'lodash/isString';
import { verifyChecksum } from './util/checksum';

const versionBytes = {
  ed25519PublicKey: 6 << 3, // G (when encoded in base32)
  ed25519SecretSeed: 18 << 3, // S
  med25519PublicKey: 12 << 3, // M
  preAuthTx: 19 << 3, // T
  sha256Hash: 23 << 3, // X
  signedPayload: 15 << 3 // P
};

const strkeyTypes = {
  G: 'ed25519PublicKey',
  S: 'ed25519SecretSeed',
  M: 'med25519PublicKey',
  T: 'preAuthTx',
  X: 'sha256Hash',
  P: 'signedPayload'
};

/**
 * StrKey is a helper class that allows encoding and decoding Stellar keys
 * to/from strings, i.e. between their binary (Buffer, xdr.PublicKey, etc.) and
 * string (i.e. "GABCD...", etc.) representations.
 */
export class StrKey {
  /**
   * Encodes `data` to strkey ed25519 public key.
   *
   * @param   {Buffer} data   raw data to encode
   * @returns {string}        "G..." representation of the key
   */
  static encodeEd25519PublicKey(data) {
    return encodeCheck('ed25519PublicKey', data);
  }

  /**
   * Decodes strkey ed25519 public key to raw data.
   *
   * If the parameter is a muxed account key ("M..."), this will only encode it
   * as a basic Ed25519 key (as if in "G..." format).
   *
   * @param   {string} data   "G..." (or "M...") key representation to decode
   * @returns {Buffer}        raw key
   */
  static decodeEd25519PublicKey(data) {
    return decodeCheck('ed25519PublicKey', data);
  }

  /**
   * Returns true if the given Stellar public key is a valid ed25519 public key.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidEd25519PublicKey(publicKey) {
    return isValid('ed25519PublicKey', publicKey);
  }

  /**
   * Encodes data to strkey ed25519 seed.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeEd25519SecretSeed(data) {
    return encodeCheck('ed25519SecretSeed', data);
  }

  /**
   * Decodes strkey ed25519 seed to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeEd25519SecretSeed(address) {
    return decodeCheck('ed25519SecretSeed', address);
  }

  /**
   * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
   * @param {string} seed seed to check
   * @returns {boolean}
   */
  static isValidEd25519SecretSeed(seed) {
    return isValid('ed25519SecretSeed', seed);
  }

  /**
   * Encodes data to strkey med25519 public key.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeMed25519PublicKey(data) {
    return encodeCheck('med25519PublicKey', data);
  }

  /**
   * Decodes strkey med25519 public key to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeMed25519PublicKey(address) {
    return decodeCheck('med25519PublicKey', address);
  }

  /**
   * Returns true if the given Stellar public key is a valid med25519 public key.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidMed25519PublicKey(publicKey) {
    return isValid('med25519PublicKey', publicKey);
  }

  /**
   * Encodes data to strkey preAuthTx.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodePreAuthTx(data) {
    return encodeCheck('preAuthTx', data);
  }

  /**
   * Decodes strkey PreAuthTx to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodePreAuthTx(address) {
    return decodeCheck('preAuthTx', address);
  }

  /**
   * Encodes data to strkey sha256 hash.
   * @param {Buffer} data data to encode
   * @returns {string}
   */
  static encodeSha256Hash(data) {
    return encodeCheck('sha256Hash', data);
  }

  /**
   * Decodes strkey sha256 hash to raw data.
   * @param {string} address data to decode
   * @returns {Buffer}
   */
  static decodeSha256Hash(address) {
    return decodeCheck('sha256Hash', address);
  }

  /**
   * Encodes raw data to strkey signed payload (P...).
   * @param   {Buffer} data  data to encode
   * @returns {string}
   */
  static encodeSignedPayload(data) {
    return encodeCheck('signedPayload', data);
  }

  /**
   * Decodes strkey signed payload (P...) to raw data.
   * @param   {string} address  address to decode
   * @returns {Buffer}
   */
  static decodeSignedPayload(address) {
    return decodeCheck('signedPayload', address);
  }

  /**
   * Checks validity of alleged signed payload (P...) strkey address.
   * @param   {string} address  signer key to check
   * @returns {boolean}
   */
  static isValidSignedPayload(address) {
    return isValid('signedPayload', address);
  }

  static getVersionByteForPrefix(address) {
    return strkeyTypes[address[0]];
  }
}

/**
 * Sanity-checks whether or not a strkey *appears* valid.
 *
 * @param  {string}  versionByteName the type of strkey to expect in `encoded`
 * @param  {string}  encoded         the strkey to validate
 *
 * @return {Boolean} whether or not the `encoded` strkey appears valid for the
 *     `versionByteName` strkey type (see `versionBytes`, above).
 *
 * @note This isn't a *definitive* check of validity, but rather a best-effort
 *     check based on (a) input length, (b) whether or not it can be decoded,
 *     and (c) output length.
 */
function isValid(versionByteName, encoded) {
  if (!isString(encoded)) {
    return false;
  }

  // basic length checks on the strkey lengths
  switch (versionByteName) {
    case 'ed25519PublicKey': // falls through
    case 'ed25519SecretSeed': // falls through
    case 'preAuthTx': // falls through
    case 'sha256Hash':
      if (encoded.length !== 56) {
        return false;
      }
      break;

    case 'med25519PublicKey':
      if (encoded.length !== 69) {
        return false;
      }
      break;

    case 'signedPayload':
      if (encoded.length < 56 || encoded.length > 165) {
        return false;
      }
      break;

    default:
      return false;
  }

  let decoded = '';
  try {
    decoded = decodeCheck(versionByteName, encoded);
  } catch (err) {
    return false;
  }

  // basic length checks on the resulting buffer sizes
  switch (versionByteName) {
    case 'ed25519PublicKey': // falls through
    case 'ed25519SecretSeed': // falls through
    case 'preAuthTx': // falls through
    case 'sha256Hash':
      return decoded.length === 32;

    case 'med25519PublicKey':
      return decoded.length === 40; // +8 bytes for the ID

    case 'signedPayload':
      return (
        // 32 for the signer, +4 for the payload size, then either +4 for the
        // min or +64 for the max payload
        decoded.length >= 32 + 4 + 4 && decoded.length <= 32 + 4 + 64
      );

    default:
      return false;
  }
}

export function decodeCheck(versionByteName, encoded) {
  if (!isString(encoded)) {
    throw new TypeError('encoded argument must be of type String');
  }

  const decoded = base32.decode(encoded);
  const versionByte = decoded[0];
  const payload = decoded.slice(0, -2);
  const data = payload.slice(1);
  const checksum = decoded.slice(-2);

  if (encoded !== base32.encode(decoded)) {
    throw new Error('invalid encoded string');
  }

  const expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error(
      `${versionByteName} is not a valid version byte name. ` +
        `Expected one of ${Object.keys(versionBytes).join(', ')}`
    );
  }

  if (versionByte !== expectedVersion) {
    throw new Error(
      `invalid version byte. expected ${expectedVersion}, got ${versionByte}`
    );
  }

  const expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error(`invalid checksum`);
  }

  return Buffer.from(data);
}

export function encodeCheck(versionByteName, data) {
  if (isNull(data) || isUndefined(data)) {
    throw new Error('cannot encode null data');
  }

  const versionByte = versionBytes[versionByteName];

  if (isUndefined(versionByte)) {
    throw new Error(
      `${versionByteName} is not a valid version byte name. ` +
        `Expected one of ${Object.keys(versionBytes).join(', ')}`
    );
  }
  data = Buffer.from(data);

  const versionBuffer = Buffer.from([versionByte]);
  const payload = Buffer.concat([versionBuffer, data]);
  const checksum = calculateChecksum(payload);
  const unencoded = Buffer.concat([payload, checksum]);

  return base32.encode(unencoded);
}

// Computes the CRC16-XModem checksum of `payload` in little-endian order
function calculateChecksum(payload) {
  const crcTable = [
    0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50A5, 0x60C6, 0x70E7,
    0x8108, 0x9129, 0xA14A, 0xB16B, 0xC18C, 0xD1AD, 0xE1CE, 0xF1EF,
    0x1231, 0x0210, 0x3273, 0x2252, 0x52B5, 0x4294, 0x72F7, 0x62D6,
    0x9339, 0x8318, 0xB37B, 0xA35A, 0xD3BD, 0xC39C, 0xF3FF, 0xE3DE,
    0x2462, 0x3443, 0x0420, 0x1401, 0x64E6, 0x74C7, 0x44A4, 0x5485,
    0xA56A, 0xB54B, 0x8528, 0x9509, 0xE5EE, 0xF5CF, 0xC5AC, 0xD58D,
    0x3653, 0x2672, 0x1611, 0x0630, 0x76D7, 0x66F6, 0x5695, 0x46B4,
    0xB75B, 0xA77A, 0x9719, 0x8738, 0xF7DF, 0xE7FE, 0xD79D, 0xC7BC,
    0x48C4, 0x58E5, 0x6886, 0x78A7, 0x0840, 0x1861, 0x2802, 0x3823,
    0xC9CC, 0xD9ED, 0xE98E, 0xF9AF, 0x8948, 0x9969, 0xA90A, 0xB92B,
    0x5AF5, 0x4AD4, 0x7AB7, 0x6A96, 0x1A71, 0x0A50, 0x3A33, 0x2A12,
    0xDBFD, 0xCBDC, 0xFBBF, 0xEB9E, 0x9B79, 0x8B58, 0xBB3B, 0xAB1A,
    0x6CA6, 0x7C87, 0x4CE4, 0x5CC5, 0x2C22, 0x3C03, 0x0C60, 0x1C41,
    0xEDAE, 0xFD8F, 0xCDEC, 0xDDCD, 0xAD2A, 0xBD0B, 0x8D68, 0x9D49,
    0x7E97, 0x6EB6, 0x5ED5, 0x4EF4, 0x3E13, 0x2E32, 0x1E51, 0x0E70,
    0xFF9F, 0xEFBE, 0xDFDD, 0xCFFC, 0xBF1B, 0xAF3A, 0x9F59, 0x8F78,
    0x9188, 0x81A9, 0xB1CA, 0xA1EB, 0xD10C, 0xC12D, 0xF14E, 0xE16F,
    0x1080, 0x00A1, 0x30C2, 0x20E3, 0x5004, 0x4025, 0x7046, 0x6067,
    0x83B9, 0x9398, 0xA3FB, 0xB3DA, 0xC33D, 0xD31C, 0xE37F, 0xF35E,
    0x02B1, 0x1290, 0x22F3, 0x32D2, 0x4235, 0x5214, 0x6277, 0x7256,
    0xB5EA, 0xA5CB, 0x95A8, 0x8589, 0xF56E, 0xE54F, 0xD52C, 0xC50D,
    0x34E2, 0x24C3, 0x14A0, 0x0481, 0x7466, 0x6447, 0x5424, 0x4405,
    0xA7DB, 0xB7FA, 0x8799, 0x97B8, 0xE75F, 0xF77E, 0xC71D, 0xD73C,
    0x26D3, 0x36F2, 0x0691, 0x16B0, 0x6657, 0x7676, 0x4615, 0x5634,
    0xD94C, 0xC96D, 0xF90E, 0xE92F, 0x99C8, 0x89E9, 0xB98A, 0xA9AB,
    0x5844, 0x4865, 0x7806, 0x6827, 0x18C0, 0x08E1, 0x3882, 0x28A3,
    0xCB7D, 0xDB5C, 0xEB3F, 0xFB1E, 0x8BF9, 0x9BD8, 0xABBB, 0xBB9A,
    0x4A75, 0x5A54, 0x6A37, 0x7A16, 0x0AF1, 0x1AD0, 0x2AB3, 0x3A92,
    0xFD2E, 0xED0F, 0xDD6C, 0xCD4D, 0xBDAA, 0xAD8B, 0x9DE8, 0x8DC9,
    0x7C26, 0x6C07, 0x5C64, 0x4C45, 0x3CA2, 0x2C83, 0x1CE0, 0x0CC1,
    0xEF1F, 0xFF3E, 0xCF5D, 0xDF7C, 0xAF9B, 0xBFBA, 0x8FD9, 0x9FF8,
    0x6E17, 0x7E36, 0x4E55, 0x5E74, 0x2E93, 0x3EB2, 0x0ED1, 0x1EF0
  ];

  let crc16 = 0x0;

  for (let i = 0; i < payload.length; i += 1) {
    const byte = payload[i];
    const lookupIndex = (crc16 >> 8) ^ byte;
    crc16 = (crc16 << 8) ^ crcTable[lookupIndex];
    crc16 &= 0xffff;
  }
  const checksum = new Uint8Array(2);
  checksum[0] = crc16 & 0xff;
  checksum[1] = (crc16 >> 8) & 0xff;
  return checksum;
}
