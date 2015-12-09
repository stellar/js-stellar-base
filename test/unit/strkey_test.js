var keypair          = StellarBase.Keypair.master();
let unencodedBuffer  = keypair.rawPublicKey();
let unencoded        = unencodedBuffer.toString();
let accountIdEncoded = keypair.accountId();
let seedEncoded      = StellarBase.encodeCheck("seed", unencodedBuffer);

describe('StellarBase#decodeCheck', function() {

  it("decodes correctly", function() {
    expectBuffersToBeEqual(StellarBase.decodeCheck("accountId", accountIdEncoded), unencodedBuffer);
    expectBuffersToBeEqual(StellarBase.decodeCheck("seed", seedEncoded), unencodedBuffer);
  });

  it("throws an error when the version byte is not defined", function() {
    expect(() => StellarBase.decodeCheck("notreal", "GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL")).to.throw(/notreal is not a valid/);
    expect(() => StellarBase.decodeCheck("broken", "SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCU")).to.throw(/broken is not a valid/);
  });

  it("throws an error when the version byte is wrong", function() {
    expect(() => StellarBase.decodeCheck("seed", "GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL")).to.throw(/invalid version/);
    expect(() => StellarBase.decodeCheck("accountId", "SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCU")).to.throw(/invalid version/);
  });

  it("throws an error when decoded data encodes to other string", function() {
    // accountId
    expect(() => StellarBase.decodeCheck("accountId", "GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("accountId", "GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("accountId", "GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("accountId", "GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("accountId", "GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T")).to.throw(/invalid encoded string/);
    // seed
    expect(() => StellarBase.decodeCheck("seed", "SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYW")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("seed", "SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("seed", "SB7OJNF5727F3RJUG5ASQJ3LUM44ELLNKW35ZZQDHMVUUQNGYWMEGB2W2T")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("seed", "SCMB30FQCIQAWZ4WQTS6SVK37LGMAFJGXOZIHTH2PY6EXLP37G46H6DT")).to.throw(/invalid encoded string/);
    expect(() => StellarBase.decodeCheck("seed", "SAYC2LQ322EEHZYWNSKBEW6N66IRTDREEBUXXU5HPVZGMAXKLIZNM45H++")).to.throw(/invalid encoded string/);
  });

  it("throws an error when the checksum is wrong", function() {
    expect(() => StellarBase.decodeCheck("accountId", "GBPXXOA5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVT")).to.throw(/invalid checksum/);
    expect(() => StellarBase.decodeCheck("seed", "SBGWKM3CD4IL47QN6X54N6Y33T3JDNVI6AIJ6CD5IM47HG3IG4O36XCX")).to.throw(/invalid checksum/);
  });
});


describe('StellarBase#encodeCheck', function() {

  it("encodes a buffer correctly", function() {
    expect(StellarBase.encodeCheck("accountId", unencodedBuffer)).to.eql(accountIdEncoded);
    expect(StellarBase.encodeCheck("seed", unencodedBuffer)).to.eql(seedEncoded);
  });

  it("encodes a buffer correctly", function() {
    expect(StellarBase.encodeCheck("accountId", unencodedBuffer)).to.eql(accountIdEncoded);
    expect(StellarBase.encodeCheck("seed", unencodedBuffer)).to.eql(seedEncoded);
  });


  it("throws an error when the data is null", function() {
    expect(() => StellarBase.encodeCheck("seed", null)).to.throw(/null data/);
    expect(() => StellarBase.encodeCheck("accountId", null)).to.throw(/null data/);
  });

  it("throws an error when the version byte is not defined", function() {
    expect(() => StellarBase.encodeCheck("notreal", unencoded)).to.throw(/notreal is not a valid/);
    expect(() => StellarBase.encodeCheck("broken", unencoded)).to.throw(/broken is not a valid/);
  });
});


function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');

  expect(leftHex).to.eql(rightHex);
}
