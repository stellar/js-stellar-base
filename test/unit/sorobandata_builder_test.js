let xdr = StellarBase.xdr;
let dataBuilder = StellarBase.SorobanDataBuilder;

describe('SorobanTransactionData can be built', function () {
  const address = new StellarBase.Address(
    StellarBase.Keypair.random().publicKey()
  );

  const sentinel = new xdr.SorobanTransactionData({
    resources: new xdr.SorobanResources({
      footprint: new xdr.LedgerFootprint({ readOnly: [], readWrite: [] }),
      instructions: 1,
      readBytes: 2,
      writeBytes: 3
    }),
    ext: new xdr.ExtensionPoint(0),
    refundableFee: new xdr.Int64(4)
  });

  const key = xdr.LedgerKey.contractData(
    new xdr.LedgerKeyContractData({
      contract: address.toScAddress(),
      key: address.toScVal(),
      durability: xdr.ContractDataDurability.persistent()
    })
  );

  it('constructs from xdr, base64, and nothing', function () {
    new dataBuilder();
    const fromRaw = new dataBuilder(sentinel).build();
    const fromStr = new dataBuilder(sentinel.toXDR('base64')).build();

    expect(fromRaw).to.eql(sentinel);
    expect(fromStr).to.eql(sentinel);
  });

  it('sets properties as expected', function () {
    expect(
      new dataBuilder().setResources(1, 2, 3).setRefundableFee(4).build()
    ).to.eql(sentinel);

    // this isn't a valid param but we're just checking that setters work
    const withFootprint = new dataBuilder().setFootprint([key], [key]).build();
    expect(withFootprint.resources().footprint().readOnly()[0]).to.eql(key);
    expect(withFootprint.resources().footprint().readWrite()[0]).to.eql(key);
  });

  it('leaves untouched footprints untouched', function () {
    const builder = new dataBuilder();

    const data = builder.setFootprint([key], [key]).build();
    const data2 = new dataBuilder(data).setFootprint(null, []).build();

    expect(data.resources().footprint().readOnly()).to.eql([key]);
    expect(data.resources().footprint().readWrite()).to.eql([key]);
    expect(data2.resources().footprint().readOnly()).to.eql([key]);
    expect(data2.resources().footprint().readWrite()).to.eql([]);
  });

  it('appends footprints', function () {
    const builder = new dataBuilder();

    const data = builder
      .setFootprint([key], [key])
      .appendFootprint([key, key], []);
    const built = data.build();

    expect(data.getReadOnly()).to.eql([key, key, key]);
    expect(data.getReadWrite()).to.eql([key]);
    expect(built.resources().footprint().readOnly()).to.eql([key, key, key]);
    expect(built.resources().footprint().readWrite()).to.eql([key]);
  });

  it('makes copies on build()', function () {
    const builder = new dataBuilder();
    const first = builder.build();
    const second = builder.setRefundableFee(100).build();

    expect(first.refundableFee()).to.not.eql(second.refundableFee());
  });
});
