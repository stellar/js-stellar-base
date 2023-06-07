import { LargeInt } from 'js-xdr';

export class Uint256 extends LargeInt {
  constructor(...args) {
    super(args);
  }

  get unsigned() {
    return true;
  }

  get size() {
    return 256;
  }
}

Uint256.defineIntBoundaries();
