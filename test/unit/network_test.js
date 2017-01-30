describe("Network.current()", function() {
  it("defaults network is null", function() {
    expect(StellarBase.Network.current()).to.be.null;
  });
});

describe("Network.useTestNetwork()", function() {
  it("switches to the test network", function() {
    StellarBase.Network.useTestNetwork();
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.TESTNET)
  });
});

describe("Network.usePublicNetwork()", function() {
  it("switches to the public network", function() {
    StellarBase.Network.usePublicNetwork();
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.PUBLIC)
  });
});
