import { BigInteger } from '../../src/numbers/generic';

describe('creating large integers', function () {
  describe('picks the right types', function () {
    [
      [[1, 1], 'u64'],
      [[1, -1], 'i64'],
      [[1, 1, 1, 1], 'u128'],
      [[1, 1, 1, -1], 'i128'],
      [[1, 1, 1, 1, 1, 1, 1, -1], 'i256'],
      [[1, 1, 1, 1, 1, 1, 1, 1], 'u256'],
      [[1n << 65n], 'u128'],
      [[-(1n << 65n)], 'i128'],
      [[1n << 65n, 1n << 65n], 'u256'],
      [[1n << 129n], 'u256'],
      [[-(1n << 129n)], 'i256'],
      [new Array(8).fill(-1), 'i256'],
      [new Array(8).fill(1), 'u256'],
    ].forEach(([parts, type]) => {
      it(`picks ${type} for ${parts}`, function () {
        expect(new BigInteger(parts).type).to.equal(type);
      });
    });
  });

  it('handles 64 bits', function () {
    const b = new StellarBase.BigInteger([1, -2]);
    const expected = -(2n << 32n) | 1n;

    expect(b.toBigInt()).to.eql(expected);

    const i128 = b.toI128().i128();
    console.log(i128.lo())
    expect(i128.lo().toBigInt()).to.equal(expected);
    expect(i128.hi().toBigInt()).to.equal(0n);

    const u128 = b.toU128().u128();
    expect(u128.hi().toBigInt()).to.equal(0n);
    expect(u128.lo().toBigInt()).to.equal(-expected);
  });

  describe('error handling', function () {
    ['u64', 'u128', 'u256'].forEach((type) => {
      it(`throws when signed parts and {type: '${type}'}`, function () {
        expect(
          () => new StellarBase.BigInteger([1n, -2n], { type })
        ).to.throw(/negative/i);
        expect(
          () => new StellarBase.BigInteger([-1n, -2n], { type })
        ).to.throw(/negative/i);
      });
    });

    it('throws when too many parts', function () {
      expect(() => new StellarBase.BigInteger(new Array(9).fill(42n))).to.throw(
        /expected/i
      );
    });

    it('throws when big interpreted as small', function () {
      let big;

      big = new StellarBase.BigInteger([1, 2]);
      expect(() => big.toNumber()).to.throw(/too large/i);

      big = new StellarBase.BigInteger([1n << 33n]);
      expect(() => big.toNumber()).to.throw(/too large/i);

      big = new StellarBase.BigInteger([1], { type: 'i128' });
      expect(() => big.toNumber()).to.throw(/too large/i);
      expect(() => big.toU64()).to.throw(/too large/i);
      expect(() => big.toI64()).to.throw(/too large/i);

      big = new StellarBase.BigInteger([1], { type: 'i256' });
      expect(() => big.toNumber()).to.throw(/too large/i);
      expect(() => big.toU64()).to.throw(/too large/i);
      expect(() => big.toI64()).to.throw(/too large/i);
      expect(() => big.toI128()).to.throw(/too large/i);
      expect(() => big.toU128()).to.throw(/too large/i);
    });

    it('throws when there are inconsistent negative parts', function () {
      expect(() => new StellarBase.BigInteger([1n, -3n, -4n, 5n])).to.throw(
        /negative/i
      );
    });
  });
});

// import { XdrWriter, XdrReader } from 'js-xdr';

// let I256 = StellarBase.xdr.I256;

// describe('I256.read', function () {
//   it('decodes correctly', function () {
//     expect(read([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])).to.eql(new I256(0));
//     expect(read([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01])).to.eql(new I256(1));
//     expect(read([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])).to.eql(new I256(-1));
//     expect(read([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])).to.eql(new I256(I256.MAX_VALUE));
//     expect(read([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])).to.eql(new I256(I256.MIN_VALUE));
//   });

//   function read(bytes) {
//     let io = new XdrReader(bytes);
//     return I256.read(io);
//   }
// });

// describe('I256.write', function () {
//   it('encodes correctly', function () {
//     expect(write(new I256(0))).to.eql([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
//     expect(write(new I256(1))).to.eql([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
//     expect(write(new I256(-1))).to.eql([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
//     expect(write(I256.MAX_VALUE)).to.eql([0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
//     expect(write(I256.MIN_VALUE)).to.eql([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
//   });

//   function write(value) {
//     let io = new XdrWriter(8);
//     I256.write(value, io);
//     return io.toArray();
//   }
// });

// describe('I256.isValid', function () {
//   it('returns true for I256 instances', function () {
//     expect(I256.isValid(I256.MIN_VALUE)).to.be.true;
//     expect(I256.isValid(I256.MAX_VALUE)).to.be.true;
//     expect(I256.isValid(I256.fromString('0'))).to.be.true;
//     expect(I256.isValid(I256.fromString('-1'))).to.be.true;
//     expect(I256.isValid(5n)).to.be.true;
//   });

//   it('returns false for non I256', function () {
//     expect(I256.isValid(null)).to.be.false;
//     expect(I256.isValid(undefined)).to.be.false;
//     expect(I256.isValid([])).to.be.false;
//     expect(I256.isValid({})).to.be.false;
//     expect(I256.isValid(1)).to.be.false;
//     expect(I256.isValid(true)).to.be.false;
//   });
// });

// describe('I256.slice', function () {
//   it('slices number to parts', function () {
//     expect(new I256(-0x7FFFFFFF800000005FFFFFFFA00000003FFFFFFFC00000001FFFFFFFFn).slice(32)).to.be.eql([1n, -2n, 3n, -4n, 5n, -6n, 7n, -8n]);
//     expect(new I256(-0x7FFFFFFF800000005FFFFFFFA00000003FFFFFFFC00000001FFFFFFFFn).slice(64)).to.be.eql([-0x1FFFFFFFFn, -0x3FFFFFFFDn, -0x5FFFFFFFBn, -0x7FFFFFFF9n]);
//     expect(new I256(-0x7FFFFFFF800000005FFFFFFFA00000003FFFFFFFC00000001FFFFFFFFn).slice(128)).to.be.eql([-0x3fffffffc00000001ffffffffn, -0x7fffffff800000005fffffffbn]);
//   });
// });

// describe('I256.fromString', function () {
//   it('works for positive numbers', function () {
//     expect(I256.fromString('1059').toString()).to.eql('1059');
//   });

//   it('works for negative numbers', function () {
//     expect(I256.fromString('-105909234885029834059234850234985028304085').toString()).to.eql('-105909234885029834059234850234985028304085');
//   });

//   it('fails when providing a string with a decimal place', function () {
//     expect(() => I256.fromString('105946095601.5')).to.throw(/Invalid/);
//   });
// });
