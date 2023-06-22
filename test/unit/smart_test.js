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

  it('works with all intended native types', function () {
    const scv = SmartParser.toScVal(gigaMap);

    // test case expectation sanity check
    expect(targetScv.value().length).to.equal(Object.keys(gigaMap).length);
    expect(scv.switch().name).to.equal('scvMap');
    expect(scv.value().length).to.equal(targetScv.value().length);

    // iterate for granular errors on failures
    targetScv.value().forEach((entry, idx) => {
      const actual = scv.value()[idx];
      expect(entry).to.deep.equal(actual, `item ${idx} doesn't match`);
    });

    expect(scv.toXDR('base64')).to.deep.equal(targetScv.toXDR('base64'));
  });
});
