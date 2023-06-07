import { LargeInt } from 'js-xdr';

export class Int256 extends LargeInt {
  constructor(...args) {
    super(args);
  }

  get unsigned() {
    return false;
  }

  get size() {
    return 256;
  }
}

Int256.defineIntBoundaries();
