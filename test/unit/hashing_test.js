
describe('StellarBase#hash', function() {

  it("hashes a string properly, using SHA256", function() {
    let msg         = "hello world";
    let expectedHex = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    let actualHex   = StellarBase.hash(msg).toString('hex');

    expect(actualHex).to.eql(expectedHex);
  });


  it("hashes a buffer properly, using SHA256", function() {
    let msg         = new Buffer("hello world", 'utf8');
    let expectedHex = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    let actualHex   = StellarBase.hash(msg).toString('hex');

    expect(actualHex).to.eql(expectedHex);
  });

  it("hashes an array of bytes properly, using SHA256", function() {
    let msg         = [ 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100 ];
    let expectedHex = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    let actualHex   = StellarBase.hash(msg).toString('hex');

    expect(actualHex).to.eql(expectedHex);
  });

});
