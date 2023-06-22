const xdr = StellarBase.xdr;
const SmartParser = StellarBase.SmartParser;
const ScInt = StellarBase.ScInt; // shorthand

describe('parsing and building ScVals', function () {
  const gigaMap = {
    bool: true,
    void: null,
    u32: xdr.ScVal.scvU32(1),
    i32: xdr.ScVal.scvI32(1),
    u64: 1n,
    i64: -1n,
    u128: new ScInt(1).toU128(),
    i128: new ScInt(1).toI128(),
    u256: new ScInt(1).toU256(),
    i256: new ScInt(1).toI256(),
    map: {
      arbitrary: 1n,
      nested: 'values',
      etc: false
    },
    vec: ['same', 'type', 'list']
  };

  const targetScv = xdr.ScVal.scvMap(
    [
      ['bool', xdr.ScVal.scvBool(true)],
      ['void', xdr.ScVal.scvVoid()],
      ['u32', xdr.ScVal.scvU32(1)],
      ['i32', xdr.ScVal.scvI32(1)],
      ['u64', xdr.ScVal.scvU64(new xdr.Uint64(1))],
      ['i64', xdr.ScVal.scvI64(new xdr.Int64(-1))],
      ['u128', new ScInt(1, { type: 'u128' }).toScVal()],
      ['i128', new ScInt(1, { type: 'i128' }).toScVal()],
      ['u256', new ScInt(1, { type: 'u256' }).toScVal()],
      ['i256', new ScInt(1, { type: 'i256' }).toScVal()],
      [
        'map',
        xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('arbitrary'),
            val: xdr.ScVal.scvU64(new xdr.Uint64(1))
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('nested'),
            val: xdr.ScVal.scvString('values')
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('etc'),
            val: xdr.ScVal.scvBool(false)
          })
        ])
      ],
      [
        'vec',
        xdr.ScVal.scvVec(['same', 'type', 'list'].map(xdr.ScVal.scvString))
      ]
    ].map(([type, scv]) => {
      return new xdr.ScMapEntry({
        key: new xdr.ScVal.scvString(type),
        val: scv
      });
    })
  );

  it('builds an ScVal from all intended native types', function () {
    const scv = SmartParser.toScVal(gigaMap);

    // test case expectation sanity check
    expect(targetScv.value().length).to.equal(Object.keys(gigaMap).length);
    expect(scv.switch().name).to.equal('scvMap');
    expect(scv.value().length).to.equal(targetScv.value().length);

    // iterate for granular errors on failures
    targetScv.value().forEach((entry, idx) => {
      const actual = scv.value()[idx];
      // console.log(idx, 'exp:', JSON.stringify(entry));
      // console.log(idx, 'act:', JSON.stringify(actual));
      expect(entry).to.deep.equal(actual, `item ${idx} doesn't match`);
    });

    expect(scv.toXDR('base64')).to.deep.equal(targetScv.toXDR('base64'));
  });

  it('converts ScVal to intended native types', function () {
    const kp = StellarBase.Keypair.random();
    const inputVec = ['Hello', 'there.', 'General', 'Kenobi!'];

    [
      [xdr.ScVal.scvVoid(), null],
      [xdr.ScVal.scvBool(true), true],
      [xdr.ScVal.scvBool(false), false],
      [xdr.ScVal.scvU32(1), 1],
      [xdr.ScVal.scvI32(1), 1],
      [new ScInt(11).toU64(), 11n],
      [new ScInt(11).toI64(), 11n],
      [new ScInt(22).toU128(), 22n],
      [new ScInt(22).toI128(), 22n],
      [new ScInt(33).toU256(), 33n],
      [new ScInt(33).toI256(), 33n],
      [xdr.ScVal.scvTimepoint(new xdr.Uint64(44n)), 44n],
      [xdr.ScVal.scvDuration(new xdr.Uint64(55n)), 55n],
      [
        xdr.ScVal.scvBytes(Buffer.alloc(32, '\xba')),
        Buffer.from('\xba'.repeat(16))
      ],
      [
        xdr.ScVal.scvString("hello there!"),
        "hello there!"
      ],
      [
        xdr.ScVal.scvString(Buffer.alloc(32, '\xba')),
        '\xba'.repeat(16)
      ],
      [
        new StellarBase.Address(kp.publicKey()).toScVal(),
        (actual) => actual.toString() === kp.publicKey()
      ],
      [
        xdr.ScVal.scvVec(inputVec.map(xdr.ScVal.scvString)),
        inputVec
      ]
    ].forEach(([scv, expected]) => {
      const actual = SmartParser.fromScVal(scv);

      if (typeof expected === 'function') {
        expect(expected(actual)).to.be.true;
      } else {
        expect(actual).to.deep.equal(expected);
      }
    });
  });
});
