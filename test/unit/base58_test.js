
describe('StellarBase#decodeBase58', function() {

  it("decodes correctly", function() {

    expectBuffersToBeEqual(StellarBase.decodeBase58("z"), new Buffer([0x39]));
    expectBuffersToBeEqual(StellarBase.decodeBase58("gggz"), new Buffer([0x00, 0x00, 0x00, 0x39]));
    expectBuffersToBeEqual(StellarBase.decodeBase58("s7zHL"), new Buffer([0xFF, 0xFF, 0xFF]));
  });

  it("throws an error when an input character is invalid", function() {
    expect(() => StellarBase.decodeBase58("000")).to.throw(/Non-base58 character/);
    expect(() => StellarBase.decodeBase58("\0")).to.throw(/Non-base58 character/);
    expect(() => StellarBase.decodeBase58("\xff")).to.throw(/Non-base58 character/);
  });
});


describe('StellarBase#encodeBase58', function() {

  it("encodes a buffer correctly", function() {
    expect(StellarBase.encodeBase58(new Buffer([0x39]))).to.eql("z");
    expect(StellarBase.encodeBase58(new Buffer([0x00, 0x00, 0x00, 0x39]))).to.eql("gggz");
    expect(StellarBase.encodeBase58(new Buffer([0xFF, 0xFF, 0xFF]))).to.eql("s7zHL");
  });

  it("encodes a array of bytes correctly", function() {
    expect(StellarBase.encodeBase58([0x39])).to.eql("z");
    expect(StellarBase.encodeBase58([0x00, 0x00, 0x00, 0x39])).to.eql("gggz");
    expect(StellarBase.encodeBase58([0xFF, 0xFF, 0xFF])).to.eql("s7zHL");
  });

  it("throws an error when the data is null", function() {
    expect(() => StellarBase.encodeBase58(null)).to.throw(/null data/);
    expect(() => StellarBase.encodeBase58(undefined)).to.throw(/null data/);
  });

});


var keypair          = StellarBase.Keypair.master();
let unencodedBuffer  = keypair.rawPublicKey();
let unencoded        = unencodedBuffer.toString();
let accountIdEncoded = keypair.address();
let seedEncoded      = StellarBase.encodeBase58Check("seed", unencodedBuffer);

describe('StellarBase#decodeBase58Check', function() {

  it("decodes correctly", function() {
    expectBuffersToBeEqual(StellarBase.decodeBase58Check("accountId", accountIdEncoded), unencodedBuffer);
    expectBuffersToBeEqual(StellarBase.decodeBase58Check("seed", seedEncoded), unencodedBuffer);
  });

  it("throws an error when the version byte is not defined", function() {
    expect(() => StellarBase.decodeBase58Check("notreal", "gpvQBfBaMiGQZ2xUqW9KNR")).to.throw(/notreal is not a valid/);
    expect(() => StellarBase.decodeBase58Check("broken", "n3GdokGwy1qJ11qLmsTzoL")).to.throw(/broken is not a valid/);
  });

  it("throws an error when the version byte is wrong", function() {
    expect(() => StellarBase.decodeBase58Check("seed", "gpvQBfBaMiGQZ2xUqW9KNR")).to.throw(/invalid version/);
    expect(() => StellarBase.decodeBase58Check("accountId", "n3GdokGwy1qJ11qLmsTzoL")).to.throw(/invalid version/);
  });

  it("throws an error when the checksum is wrong", function() {
    expect(() => StellarBase.decodeBase58Check("accountId", "gpvQBfBaMiGQZ2xUqW9KNz")).to.throw(/invalid checksum/);
    expect(() => StellarBase.decodeBase58Check("seed", "n3GdokGwy1qJ11qLmsTzoz")).to.throw(/invalid checksum/);
  });
});


describe('StellarBase#encodeBase58Check', function() {

  it("encodes a buffer correctly", function() {
    expect(StellarBase.encodeBase58Check("accountId", unencodedBuffer)).to.eql(accountIdEncoded);
    expect(StellarBase.encodeBase58Check("seed", unencodedBuffer)).to.eql(seedEncoded);
  });

  it("encodes a buffer correctly", function() {
    expect(StellarBase.encodeBase58Check("accountId", unencodedBuffer)).to.eql(accountIdEncoded);
    expect(StellarBase.encodeBase58Check("seed", unencodedBuffer)).to.eql(seedEncoded);
  });


  it("throws an error when the data is null", function() {
    expect(() => StellarBase.encodeBase58Check("seed", null)).to.throw(/null data/);
    expect(() => StellarBase.encodeBase58Check("accountId", null)).to.throw(/null data/);
  });

  it("throws an error when the version byte is not defined", function() {
    expect(() => StellarBase.encodeBase58Check("notreal", unencoded)).to.throw(/notreal is not a valid/);
    expect(() => StellarBase.encodeBase58Check("broken", unencoded)).to.throw(/broken is not a valid/);
  });
});


function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');

  expect(leftHex).to.eql(rightHex);
}
