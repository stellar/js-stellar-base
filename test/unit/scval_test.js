const {
  xdr,
  ScInt,
  Address,
  Keypair,
  XdrLargeInt,
  scValToNative,
  nativeToScVal,
  scValToBigInt
} = StellarBase;

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
      ['i128', new ScInt(1, { type: 'i128' }).toScVal()],
      ['i256', new ScInt(1, { type: 'i256' }).toScVal()],
      ['i32', xdr.ScVal.scvI32(1)],
      ['i64', xdr.ScVal.scvI64(new xdr.Int64(-1))],
      [
        'map',
        xdr.ScVal.scvMap([
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('arbitrary'),
            val: xdr.ScVal.scvU64(new xdr.Uint64(1))
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('etc'),
            val: xdr.ScVal.scvBool(false)
          }),
          new xdr.ScMapEntry({
            key: xdr.ScVal.scvString('nested'),
            val: xdr.ScVal.scvString('values')
          })
        ])
      ],
      ['u128', new ScInt(1, { type: 'u128' }).toScVal()],
      ['u256', new ScInt(1, { type: 'u256' }).toScVal()],
      ['u32', xdr.ScVal.scvU32(1)],
      ['u64', xdr.ScVal.scvU64(new xdr.Uint64(1))],
      [
        'vec',
        xdr.ScVal.scvVec(['same', 'type', 'list'].map(xdr.ScVal.scvString))
      ],
      ['void', xdr.ScVal.scvVoid()]
    ].map(([type, scv]) => {
      return new xdr.ScMapEntry({
        key: new xdr.ScVal.scvString(type),
        val: scv
      });
    })
  );

  it('builds an ScVal from all intended native types', function () {
    const scv = nativeToScVal(gigaMap);

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
      [xdr.ScVal.scvBytes(Buffer.alloc(32, 123)), Buffer.from('{'.repeat(32))],
      [
        xdr.ScVal.scvBytes(Buffer.alloc(32, 123)),
        new Uint8Array(32).fill(123, 0, 32)
      ],
      [xdr.ScVal.scvString('hello there!'), 'hello there!'],
      [xdr.ScVal.scvSymbol('hello'), 'hello'],
      [xdr.ScVal.scvString(Buffer.from('hello')), 'hello'], // ensure conversion
      [xdr.ScVal.scvSymbol(Buffer.from('hello')), 'hello'], // ensure conversion
      [
        new StellarBase.Address(kp.publicKey()).toScVal(),
        (actual) => actual.toString() === kp.publicKey()
      ],
      [xdr.ScVal.scvVec(inputVec.map(xdr.ScVal.scvString)), inputVec],
      [
        xdr.ScVal.scvMap(
          [
            [new ScInt(0).toI256(), xdr.ScVal.scvBool(true)],
            [xdr.ScVal.scvBool(false), xdr.ScVal.scvString('second')],
            [
              xdr.ScVal.scvU32(2),
              xdr.ScVal.scvVec(inputVec.map(xdr.ScVal.scvString))
            ]
          ].map(([key, val]) => new xdr.ScMapEntry({ key, val }))
        ),
        {
          0: true,
          false: 'second',
          2: inputVec
        }
      ]
    ].forEach(([scv, expected]) => {
      expect(() => scv.toXDR(), 'ScVal is invalid').to.not.throw();

      const actual = scValToNative(scv);

      if (typeof expected === 'function') {
        expect(expected(actual), `converting ${scv} to native`).to.be.true;
      } else {
        expect(actual).to.deep.equal(expected);
      }
    });
  });

  it('converts native types with customized types', function () {
    [
      [1, 'u32', 'scvU32'],
      [1, 'i32', 'scvI32'],
      [1, 'i64', 'scvI64'],
      [1, 'i128', 'scvI128'],
      [1, 'u256', 'scvU256'],
      ['a', 'symbol', 'scvSymbol'],
      ['a', undefined, 'scvString'],
      [Buffer.from('abcdefg'), undefined, 'scvBytes'],
      [Buffer.from('abcdefg'), 'string', 'scvString'],
      [Buffer.from('abcdefg'), 'symbol', 'scvSymbol']
    ].forEach(([input, typeSpec, outType]) => {
      let scv = nativeToScVal(input, { type: typeSpec });
      expect(scv.switch().name).to.equal(
        outType,
        `in: ${input}, ${typeSpec}\nout: ${JSON.stringify(scv, null, 2)}`
      );
    });

    let scv;

    scv = nativeToScVal(['a', 'b', 'c'], { type: 'symbol' });
    expect(scv.switch().name).to.equal('scvVec');
    scv.value().forEach((v) => {
      expect(v.switch().name).to.equal('scvSymbol');
    });

    scv = nativeToScVal(
      {
        hello: 'world',
        there: [1, 2, 3]
      },
      {
        type: {
          hello: ['symbol', null],
          there: [null, 'i32']
        }
      }
    );
    let e;
    expect(scv.switch().name).to.equal('scvMap');

    e = scv.value()[0];
    expect(e.key().switch().name).to.equal('scvSymbol', `${JSON.stringify(e)}`);
    expect(e.val().switch().name).to.equal('scvString', `${JSON.stringify(e)}`);

    e = scv.value()[1];
    expect(e.key().switch().name).to.equal('scvString', `${JSON.stringify(e)}`);
    expect(e.val().switch().name).to.equal('scvVec', `${JSON.stringify(e)}`);
    expect(e.val().value()[0].switch().name).to.equal(
      'scvI32',
      `${JSON.stringify(e)}`
    );
  });

  it('doesnt throw on arrays with mixed types', function () {
    expect(nativeToScVal([1, 'a', false]).switch().name).to.equal('scvVec');
  });

  it('lets strings be small integer ScVals', function () {
    ['i32', 'u32'].forEach((type) => {
      const scv = nativeToScVal('12345', { type });
      expect(scv.switch()).to.eql(
        type === 'u32' ? xdr.ScValType.scvU32() : xdr.ScValType.scvI32()
      );
      expect(scv.value()).to.eql(12345);
    });
  });

  it('lets strings be large integer ScVals', function () {
    ['i64', 'i128', 'i256', 'u64', 'u128', 'u256'].forEach((type) => {
      const scv = nativeToScVal('12345', { type });
      expect(XdrLargeInt.getType(scv.switch().name)).to.equal(type);
      expect(scValToBigInt(scv)).to.equal(BigInt(12345));
    });

    expect(() => nativeToScVal('not a number', { type: 'i128' })).to.throw();
    expect(() => nativeToScVal('12345', { type: 'notnumeric' })).to.throw();
  });

  it('lets strings be addresses', function () {
    [
      'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
      'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIFY6YQGAXE',
      Keypair.random().publicKey(),
      Keypair.random().publicKey()
    ].forEach((addr) => {
      const scv = nativeToScVal(addr, { type: 'address' });
      const equiv = new Address(addr).toScVal();

      expect(scv.switch().name).to.be.equal('scvAddress');
      expect(scv).to.deep.equal(equiv);
    });
  });

  it('parses errors', function () {
    const userErr = xdr.ScVal.scvError(xdr.ScError.sceContract(1234));
    const systemErr = xdr.ScVal.scvError(
      xdr.ScError.sceWasmVm(xdr.ScErrorCode.scecInvalidInput())
    );

    const native = scValToNative(xdr.ScVal.scvVec([userErr, systemErr]));

    expect(native).to.deep.equal([
      { type: 'contract', code: 1234 },
      {
        type: 'system',
        code: systemErr.error().code().value,
        value: systemErr.error().code().name
      }
    ]);
  });

  it('can sort maps by string', function () {
    const sample = nativeToScVal(
      { a: 1, b: 2, c: 3 },
      {
        type: {
          a: ['symbol'],
          b: ['symbol'],
          c: ['symbol']
        }
      }
    );
    ['a', 'b', 'c'].forEach((val, idx) => {
      expect(sample.value()[idx].key().value()).to.equal(val);
    });

    // nativeToScVal will sort, so we need to "unsort" to make sure it works.
    // We'll do this by swapping 0 (a) and 2 (c).
    let tmp = sample.value()[0];
    sample.value()[0] = sample.value()[2];
    sample.value()[2] = tmp;

    ['c', 'b', 'a'].forEach((val, idx) => {
      expect(sample.value()[idx].key().value()).to.equal(val);
    });

    const sorted = xdr.scvMapSorted(sample.value());
    expect(sorted.switch().name).to.equal('scvMap');
    ['a', 'b', 'c'].forEach((val, idx) => {
      expect(sorted.value()[idx].key().value()).to.equal(val);
    });
  });

  it('can sort number-like maps', function () {
    const sample = nativeToScVal(
      { 1: 'a', 2: 'b', 3: 'c' },
      {
        type: {
          1: ['i64', 'symbol'],
          2: ['i64', 'symbol'],
          3: ['i64', 'symbol']
        }
      }
    );
    expect(sample.value()[0].key().switch().name).to.equal('scvI64');

    [1n, 2n, 3n].forEach((val, idx) => {
      let underlyingKey = sample.value()[idx].key().value();
      expect(underlyingKey.toBigInt()).to.equal(val);
    });

    // nativeToScVal will sort, so we need to "unsort" to make sure it works.
    // We'll do this by swapping 0th (1n) and 2nd (3n).
    let tmp = sample.value()[0];
    sample.value()[0] = sample.value()[2];
    sample.value()[2] = tmp;

    [3n, 2n, 1n].forEach((val, idx) => {
      expect(sample.value()[idx].key().value().toBigInt()).to.equal(val);
    });

    const sorted = xdr.scvMapSorted(sample.value());
    expect(sorted.switch().name).to.equal('scvMap');
    [1n, 2n, 3n].forEach((val, idx) => {
      expect(sorted.value()[idx].key().value().toBigInt()).to.equal(val);
    });
  });
});
