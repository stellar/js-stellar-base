import { ScInt } from '../../src/numbers/scint';
import { I128, U128, I256, U256 } from '../../src/numbers/scint';
import xdr from '../../src/xdr';

describe('creating large integers', function () {
  describe('picks the right types', function () {
    Object.entries({
      u64: [1, '1', 0xdeadbeef, (1n << 64n) - 1n],
      u128: [1n << 64n, (1n << 128n) - 1n],
      u256: [1n << 128n, (1n << 256n) - 1n]
    }).forEach(([type, values]) => {
      values.forEach((value) => {
        it(`picks ${type} for ${value}`, function () {
          const bi = new ScInt(value);
          expect(bi.type).to.equal(type);
          expect(bi.toBigInt()).to.equal(BigInt(value));
        });
      });
    });
  });

  it('has correct utility methods', function () {
    const v =
      123456789123456789123456789123456789123456789123456789123456789123456789n;
    const i = new ScInt(v);
    expect(i.valueOf()).to.be.eql(new U256(v));
    expect(i.toString()).to.be.equal(
      '123456789123456789123456789123456789123456789123456789123456789123456789'
    );
    expect(i.toJSON()).to.be.eql({ value: v.toString(), type: 'u256' });
  });

  describe('64 bit inputs', function () {
    const sentinel = 800000085n;

    it('handles 64 bits', function () {
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

  describe('conversion to/from ScVals', function () {
    const v = 80000085n;
    const i = new ScInt(v);

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
        expect(typeof scv.toXDR('base64')).to.be.equal('string');

        const bigi = ScInt.fromScVal(scv);
        expect(bigi).to.equal(v);
        expect(new ScInt(bigi, { type }).toJSON()).to.eql({
          ...i.toJSON(),
          type
        });
      });
    });

    it('works for 32-bit', function () {
      const i32 = new xdr.ScVal.scvI32(Number(v));
      const u32 = new xdr.ScVal.scvU32(Number(v));

      expect(ScInt.fromScVal(i32)).to.equal(v);
      expect(ScInt.fromScVal(u32)).to.equal(v);
    });

    it('throws for non-integers', function () {
      expect(() => ScInt.fromScVal(new xdr.ScVal.scvString('hello'))).to.throw(
        /integer/i
      );
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
