import isUndefined from 'lodash/isUndefined';
import bs58 from './vendor/bs58';
import { hash } from './hashing';
import { verifyChecksum } from './util/checksum';

const versionBytes = {
  accountId: 0x00, // decimal 0
  none: 0x01, // decimal 1
  seed: 0x21 // decimal 33
};

export function decodeBase58Check(versionByteName, encoded) {
  const decoded = bs58.decode(encoded);
  const versionByte = decoded[0];
  const payload = decoded.slice(0, decoded.length - 4);
  const data = payload.slice(1);
  const checksum = decoded.slice(decoded.length - 4);

  const expectedVersion = versionBytes[versionByteName];

  if (isUndefined(expectedVersion)) {
    throw new Error(
      `${versionByteName} is not a valid version byte name.  expected one of "accountId", "seed", or "none"`
    );
  }

  if (versionByte !== expectedVersion) {
    throw new Error(
      `invalid version byte.  expected ${expectedVersion}, got ${versionByte}`
    );
  }

  const expectedChecksum = calculateChecksum(payload);

  if (!verifyChecksum(expectedChecksum, checksum)) {
    throw new Error(`invalid checksum`);
  }

  if (versionByteName === 'accountId' && decoded.length !== 37) {
    throw new Error(
      `Decoded address length is invalid. Expected 37, got ${decoded.length}`
    );
  }

  return Buffer.from(data);
}

function calculateChecksum(payload) {
  const inner = hash(payload);
  const outer = hash(inner);
  return outer.slice(0, 4);
}
