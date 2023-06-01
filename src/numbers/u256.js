import { LargeInt } from 'js-xdr';

export class U256 extends LargeInt {
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

U256.defineIntBoundaries();
