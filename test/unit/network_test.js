

describe("Network.current()", function() {

  it("defaults to the public network", function() {
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.PUBLIC)
  })

});

describe("Network.useTestNet()", function() {

  beforeEach(function() {
    StellarBase.Network.useDefault();
  });

  it("switches to the test network", function() {
    StellarBase.Network.useTestNet();
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.TESTNET)
  })

  it("switches to the test network using helper function", function() {
    StellarBase.Network.useTestnet();
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.TESTNET)
  })

});
