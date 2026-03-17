/**
 * Returns true if the two byte arrays are equal (used for CRC16 checksum verification).
 *
 * @param expected - the expected checksum bytes
 * @param actual - the actual checksum bytes
 */
export declare function verifyChecksum(expected: Uint8Array, actual: Uint8Array): boolean;
