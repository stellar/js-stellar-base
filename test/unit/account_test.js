
describe('Account.constructor', function() {
  it("fails to create Account object from an invalid address", function() {
    expect(() => new StellarBase.Account('GBBB')).to.throw(/accountId is invalid/);
  });

  it("fails to create Account object from an invalid sequence number", function() {
    expect(() => new StellarBase.Account('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB', 100)).to.throw(/sequence must be of type string/);
  });

  it("creates an Account object", function() {
    let account = new StellarBase.Account('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB', '100');
    expect(account.accountId()).to.equal("GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB");
    expect(account.sequenceNumber()).to.equal("100");
  });
});

describe('Account.isValidAccountId', function() {

  it("returns true for valid address", function() {
    var addresses = [
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      'GB7KKHHVYLDIZEKYJPAJUOTBE5E3NJAXPSDZK7O6O44WR3EBRO5HRPVT',
      'GD6WVYRVID442Y4JVWFWKWCZKB45UGHJAABBJRS22TUSTWGJYXIUR7N2',
      'GBCG42WTVWPO4Q6OZCYI3D6ZSTFSJIXIS6INCIUF23L6VN3ADE4337AP',
      'GDFX463YPLCO2EY7NGFMI7SXWWDQAMASGYZXCG2LATOF3PP5NQIUKBPT',
      'GBXEODUMM3SJ3QSX2VYUWFU3NRP7BQRC2ERWS7E2LZXDJXL2N66ZQ5PT',
      'GAJHORKJKDDEPYCD6URDFODV7CVLJ5AAOJKR6PG2VQOLWFQOF3X7XLOG',
      'GACXQEAXYBEZLBMQ2XETOBRO4P66FZAJENDHOQRYPUIXZIIXLKMZEXBJ',
      'GDD3XRXU3G4DXHVRUDH7LJM4CD4PDZTVP4QHOO4Q6DELKXUATR657OZV',
      'GDTYVCTAUQVPKEDZIBWEJGKBQHB4UGGXI2SXXUEW7LXMD4B7MK37CWLJ'
    ];

    for (var i in addresses) {
      expect(StellarBase.Account.isValidAccountId(addresses[i])).to.be.true;
    }
  });

  it("returns false for invalid address", function() {
    var addresses = [
      'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL',
      'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++',
      'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA',
      'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2',
      'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T',
      'GDXIIZTKTLVYCBHURXL2UPMTYXOVNI7BRAEFQCP6EZCY4JLKY4VKFNLT',
      'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wt',
      'test',
      'g4VPBPrHZkfE8CsjuG2S4yBQNd455UWmk' // Old network address
    ];

    for (var i in addresses) {
      expect(StellarBase.Account.isValidAccountId(addresses[i])).to.be.false;
    }
  });

});

describe('Account.incrementSequenceNumber', function() {
  it("correctly increments the sequence number", function() {
    let account = new StellarBase.Account('GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB', '100');
    account.incrementSequenceNumber();
    expect(account.sequenceNumber()).to.equal("101");
    account.incrementSequenceNumber();
    account.incrementSequenceNumber();
    expect(account.sequenceNumber()).to.equal("103");
  });
});
