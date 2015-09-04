

describe("Network.current()", function() {

  it("defaults to the public network", function() {
    expect(StellarBase.Network.current().networkPassphrase()).to.equal(StellarBase.Networks.PUBLIC)
  })

});
