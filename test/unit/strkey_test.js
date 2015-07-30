var keypair          = StellarBase.Keypair.master();
let unencodedBuffer  = keypair.rawPublicKey();
let unencoded        = unencodedBuffer.toString();
let accountIdEncoded = keypair.address();
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
