import { LargeInt } from 'js-xdr';

export class Uint128 extends LargeInt {
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

Uint128.defineIntBoundaries();
