import { LargeInt } from 'js-xdr';

export class I256 extends LargeInt {
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

I256.defineIntBoundaries();
