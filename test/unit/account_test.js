

describe('Account.isValidAddress', function() {

  it("returns true for valid address", function() {
    var addresses = [
      'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wn',
      'gxmyboCof2iK4AwYu8gjfChX1tNdwdTWRUtqqozuDyG6cKjTpe',
      'gsvcDU4ZJSRZeX4XY1SgN42XTpCnNCiy7pP6Uo2KCasphypXUkM',
      'gX3zUTasLVqGLxTbF5VJhDvvFo3FnFkH3aYWTMd4nohZjXjz5i'
    ];

    for (var i in addresses) {
      expect(StellarBase.Account.isValidAddress(addresses[i])).to.be.true;
    }
  });

  it("returns false for invalid address", function() {
    var addresses = [
      'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wt',
      'test',
      'g4VPBPrHZkfE8CsjuG2S4yBQNd455UWmk' // Old network address
    ];

    for (var i in addresses) {
      expect(StellarBase.Account.isValidAddress(addresses[i])).to.be.false;
    }
  });

});
