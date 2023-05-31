import { LargeInt } from './large-int';

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
