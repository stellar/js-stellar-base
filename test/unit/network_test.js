

describe("Network.current()", function() {

  it("defaults to the public network", function() {
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.TESTNET)
  })

});

describe("Network.usePublicNetwork()", function() {

  beforeEach(function() {
    StellarBase.Network.useDefault();
  });

  it("switches to the public network", function() {
    StellarBase.Network.usePublicNetwork();
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.PUBLIC)
  });

});
