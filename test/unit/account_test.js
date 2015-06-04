

describe('Account.isValidAddress', function() {

  it("returns true for valid address", function() {
    var addresses = [
      'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wn',
      'gxmyboCof2iK4AwYu8gjfChX1tNdwdTWRUtqqozuDyG6cKjTpe',
      'gsvcDU4ZJSRZeX4XY1SgN42XTpCnNCiy7pP6Uo2KCasphypXUkM',
      'gX3zUTasLVqGLxTbF5VJhDvvFo3FnFkH3aYWTMd4nohZjXjz5i',
      'gsYczgcwZhqKUxuLisCCX5AecjEFwGeDdc1gSsUfRA7GE7nRa62',
      'gqZtmhekQfH69WSGEggD8sVKTi94doUbytCTR28wyBc7br8hYd',
      'g93rFuATbcGsGCS4LjHumaKunAt3fY5E53Fa1UCzGmPui37Zpi',
      'gpQ6V26bERDPg572t4VFLXX2r1pc1SPRwD4xKrrvDQwo6un29u',
      'gsWxvcM8KunwKwbZk1WLYZ5ZQqUs59XW4WqZDsMiTGrmfrD65kb',
      'gskyQ6H55Fv3ceyg1aXetUA7hopY3MYccgncG1vYQcj66Qon7jq'
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
