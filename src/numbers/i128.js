import { LargeInt } from 'js-xdr';

export class Int128 extends LargeInt {
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

Int128.defineIntBoundaries();
