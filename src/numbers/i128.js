import { LargeInt } from 'js-xdr';

export class I128 extends LargeInt {
  constructor(...args) {
    super(args);
  }

  get unsigned() {
    return false;
  }

  get size() {
    return 128;
  }
}

I128.defineIntBoundaries();
