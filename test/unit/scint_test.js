import {
  Int128 as I128,
  Uint128 as U128,
  Int256 as I256,
  Uint256 as U256
} from '../../src/numbers/xdrint';

const xdr = StellarBase.xdr; // shorthand

describe('creating large integers', function () {
  describe('picks the right types', function () {
    Object.entries({
      u64: [1, '1', 0xdeadbeef, (1n << 64n) - 1n],
      u128: [1n << 64n, (1n << 128n) - 1n],
      u256: [1n << 128n, (1n << 256n) - 1n]
    }).forEach(([type, values]) => {
      values.forEach((value) => {
        it(`picks ${type} for ${value}`, function () {
          const bi = new StellarBase.ScInt(value);
          expect(bi.type).to.equal(type);
          expect(bi.toBigInt()).to.equal(BigInt(value));
        });
      });
    });
  });

  it('has correct utility methods', function () {
    const v =
      123456789123456789123456789123456789123456789123456789123456789123456789n;
    const i = new StellarBase.ScInt(v);
    expect(i.valueOf()).to.be.eql(new U256(v));
    expect(i.toString()).to.equal(
      '123456789123456789123456789123456789123456789123456789123456789123456789'
    );
    expect(i.toJSON()).to.be.eql({ value: v.toString(), type: 'u256' });
  });

  describe('64 bit inputs', function () {
    const sentinel = 800000085n;

    it('handles u64', function () {
      let b = new StellarBase.ScInt(sentinel);
      expect(b.toBigInt()).to.equal(sentinel);
      expect(b.toNumber()).to.equal(Number(sentinel));
      let u64 = b.toU64().u64();
      expect(u64.low).to.equal(Number(sentinel));
      expect(u64.high).to.equal(0);

      b = new StellarBase.ScInt(-sentinel);
      expect(b.toBigInt()).to.equal(-sentinel);
      expect(b.toNumber()).to.equal(Number(-sentinel));
      u64 = b.toU64().u64();
      expect(u64.low).to.equal(b.toNumber());
      expect(u64.high).to.equal(-1);
    });

    it('handles i64', function () {
      let b = new StellarBase.ScInt(sentinel);
      expect(b.toBigInt()).to.equal(sentinel);
      expect(b.toNumber()).to.equal(Number(sentinel));
      let i64 = b.toI64().i64();

      expect(new xdr.Int64([i64.low, i64.high]).toBigInt()).to.equal(sentinel);
    });

    it(`upscales u64 to 128`, function () {
      const b = new StellarBase.ScInt(sentinel);
      const i128 = b.toI128().i128();
      expect(i128.lo().toBigInt()).to.equal(sentinel);
      expect(i128.hi().toBigInt()).to.equal(0n);
    });

    it(`upscales i64 to 128`, function () {
      const b = new StellarBase.ScInt(-sentinel);
      const i128 = b.toI128().i128();
      const hi = i128.hi().toBigInt();
      const lo = i128.lo().toBigInt();

      const assembled = new I128([lo, hi]).toBigInt();
      expect(assembled).to.equal(-sentinel);
    });

    it(`upscales i64 to 256`, function () {
      const b = new StellarBase.ScInt(sentinel);
      const i = b.toI256().i256();

      const [hiHi, hiLo, loHi, loLo] = [
        i.hiHi(),
        i.hiLo(),
        i.loHi(),
        i.loLo()
      ].map((i) => i.toBigInt());

      expect(hiHi).to.equal(0n);
      expect(hiLo).to.equal(0n);
      expect(loHi).to.equal(0n);
      expect(loLo).to.equal(sentinel);

      let assembled = new I256([loLo, loHi, hiLo, hiHi]).toBigInt();
      expect(assembled).to.equal(sentinel);

      assembled = new U256([loLo, loHi, hiLo, hiHi]).toBigInt();
      expect(assembled).to.equal(sentinel);
    });

    it(`upscales i64 to 256`, function () {
      const b = new StellarBase.ScInt(-sentinel);
      const i = b.toI256().i256();

      const [hiHi, hiLo, loHi, loLo] = [
        i.hiHi(),
        i.hiLo(),
        i.loHi(),
        i.loLo()
      ].map((i) => i.toBigInt());

      expect(hiHi).to.equal(-1n);
      expect(hiLo).to.equal(BigInt.asUintN(64, -1n));
      expect(loHi).to.equal(BigInt.asUintN(64, -1n));
      expect(loLo).to.equal(BigInt.asUintN(64, -sentinel));

      let assembled = new I256([loLo, loHi, hiLo, hiHi]).toBigInt();
      expect(assembled).to.equal(-sentinel);

      assembled = new U256([loLo, loHi, hiLo, hiHi]).toBigInt();
      expect(assembled).to.equal(BigInt.asUintN(256, -sentinel));
    });
  });

  describe('128 bit inputs', function () {
    const sentinel = 800000000000000000000085n; // 80 bits long

    it('handles inputs', function () {
      let b = new StellarBase.ScInt(sentinel);
      expect(b.toBigInt()).to.equal(sentinel);
      expect(() => b.toNumber()).to.throw(/too large/i);
      expect(() => b.toU64()).to.throw(/too large/i);
      expect(() => b.toI64()).to.throw(/too large/i);

      let u128 = b.toU128().u128();
      expect(
        new U128([
          u128.lo().low,
          u128.lo().high,
          u128.hi().low,
          u128.hi().high
        ]).toBigInt()
      ).to.equal(sentinel);

      b = new StellarBase.ScInt(-sentinel);
      u128 = b.toU128().u128();
      expect(
        new U128([
          u128.lo().low,
          u128.lo().high,
          u128.hi().low,
          u128.hi().high
        ]).toBigInt()
      ).to.equal(BigInt.asUintN(128, -sentinel));

      b = new StellarBase.ScInt(sentinel);
      let i128 = b.toI128().i128();
      expect(
        new I128([
          i128.lo().low,
          i128.lo().high,
          i128.hi().low,
          i128.hi().high
        ]).toBigInt()
      ).to.equal(sentinel);

      b = new StellarBase.ScInt(-sentinel);
      i128 = b.toI128().i128();
      expect(
        new I128([
          i128.lo().low,
          i128.lo().high,
          i128.hi().low,
          i128.hi().high
        ]).toBigInt()
      ).to.equal(-sentinel);
    });

    it('upscales to 256 bits', function () {
      let b = new StellarBase.ScInt(-sentinel);
      let i256 = b.toI256().i256();
      let u256 = b.toU256().u256();

      expect(
        new I256([
          i256.loLo().low,
          i256.loLo().high,
          i256.loHi().low,
          i256.loHi().high,
          i256.hiLo().low,
          i256.hiLo().high,
          i256.hiHi().low,
          i256.hiHi().high
        ]).toBigInt()
      ).to.equal(-sentinel);

      expect(
        new U256([
          u256.loLo().low,
          u256.loLo().high,
          u256.loHi().low,
          u256.loHi().high,
          u256.hiLo().low,
          u256.hiLo().high,
          u256.hiHi().low,
          u256.hiHi().high
        ]).toBigInt()
      ).to.equal(BigInt.asUintN(256, -sentinel));
    });
  });

  describe('conversion to/from ScVals', function () {
    const v = 80000085n;
    const i = new StellarBase.ScInt(v);

    [
      [i.toI64(), 'i64'],
      [i.toU64(), 'u64'],
      [i.toI128(), 'i128'],
      [i.toU128(), 'u128'],
      [i.toI256(), 'i256'],
      [i.toU256(), 'u256']
    ].forEach(([scv, type]) => {
      it(`works for ${type}`, function () {
        expect(scv.switch().name).to.equal(`scv${type.toUpperCase()}`);
        expect(typeof scv.toXDR('base64')).to.equal('string');

        const bigi = StellarBase.ScInt.fromScVal(scv);
        expect(bigi).to.equal(v);
        expect(new StellarBase.ScInt(bigi, { type }).toJSON()).to.eql({
          ...i.toJSON(),
          type
        });
      });
    });

    it('works for 32-bit', function () {
      const i32 = new xdr.ScVal.scvI32(Number(v));
      const u32 = new xdr.ScVal.scvU32(Number(v));

      expect(StellarBase.ScInt.fromScVal(i32)).to.equal(v);
      expect(StellarBase.ScInt.fromScVal(u32)).to.equal(v);
    });

    it('throws for non-integers', function () {
      expect(() =>
        StellarBase.ScInt.fromScVal(new xdr.ScVal.scvString('hello'))
      ).to.throw(/integer/i);
    });
  });

  describe('error handling', function () {
    ['u64', 'u128', 'u256'].forEach((type) => {
      it(`throws when signed parts and {type: '${type}'}`, function () {
        expect(() => new StellarBase.ScInt(-2, { type })).to.throw(/negative/i);
      });
    });

    it('throws when too big', function () {
      expect(() => new StellarBase.ScInt(1n << 400n)).to.throw(/expected/i);
    });

    it('throws when big interpreted as small', function () {
      let big;

      big = new StellarBase.ScInt(1n << 64n);
      expect(() => big.toNumber()).to.throw(/too large/i);

      big = new StellarBase.ScInt(Number.MAX_SAFE_INTEGER + 1);
      expect(() => big.toNumber()).to.throw(/too large/i);

      big = new StellarBase.ScInt(1, { type: 'i128' });
      expect(() => big.toU64()).to.throw(/too large/i);
      expect(() => big.toI64()).to.throw(/too large/i);

      big = new StellarBase.ScInt(1, { type: 'i256' });
      expect(() => big.toU64()).to.throw(/too large/i);
      expect(() => big.toI64()).to.throw(/too large/i);
      expect(() => big.toI128()).to.throw(/too large/i);
      expect(() => big.toU128()).to.throw(/too large/i);
    });
  });
});

describe('creating raw large XDR integers', function () {
  describe('array inputs', function () {
    [
      ['i64', 2],
      ['i128', 4],
      ['i256', 8]
    ].forEach(([type, count], idx) => {
      it(`works for ${type}`, function () {
        const input = new Array(count).fill(1n);
        const xdrI = new StellarBase.XdrInt(type, input);

        let expected = input.reduce((accum, v, i) => {
          return (accum << 32n) | v;
        }, 0n);

        expect(xdrI.toBigInt()).to.equal(expected);
      });
    });
  });
});
