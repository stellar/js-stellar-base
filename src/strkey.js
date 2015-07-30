import base32 from "thirty-two";
import crc from "crc";
import {isUndefined, isNull} from "lodash";

const versionBytes = {
  accountId: 0x30,
  seed:      0x90
};

export function decodeCheck(versionByteName, encoded) {
  let decoded     = base32.decode(encoded);
  let versionByte = decoded[0];
  let payload     = decoded.slice(0, -2);
  let data        = payload.slice(1);
  let checksum    = decoded.slice(-2);

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

  if (versionByteName === 'accountId' && decoded.length !== 35) {
    throw new Error(`Decoded address length is invalid. Expected 35, got ${decoded.length}`);
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

  return base32.encode(unencoded).toString();
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
