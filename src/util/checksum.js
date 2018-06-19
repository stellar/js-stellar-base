export function verifyChecksum(expected, actual) {
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