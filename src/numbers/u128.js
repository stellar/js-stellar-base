import { LargeInt } from 'js-xdr';

export class U128 extends LargeInt {
  constructor(...args) {
    super(args);
  }

  get unsigned() {
    return true;
  }

  get size() {
    return 128;
  }
}

U128.defineIntBoundaries();
