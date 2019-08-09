export function verifyChecksum(expected: string | Buffer, actual: string | string[] | number[] | Buffer): boolean {
  if (expected.length !== actual.length) {
    return false;
  }

  if (expected.length === 0) {
    return true;
  }

  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i] !== actual[i]) {
      return false;
    }
  }

  return true;
}
