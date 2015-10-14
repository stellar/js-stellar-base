

describe("Memo.text()", function() {

  it("returns a value for a correct argument", function() {
    expect(() => StellarBase.Memo.text("test")).to.not.throw();
  });

  it("throws an error when invalid argument was passed", function() {
    expect(() => StellarBase.Memo.text()).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text({})).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(10)).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(Infinity)).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(NaN)).to.throw(/Expects string/);
  });

  it("throws an error when string is longer than 28 chars", function() {
    expect(() => StellarBase.Memo.text("12345678901234567890123456789")).to.throw(/Text should be/);
  });

});

describe("Memo.id()", function() {
  it("returns a value for a correct argument", function() {
    expect(() => StellarBase.Memo.id("1000")).to.not.throw();
    expect(() => StellarBase.Memo.id("0")).to.not.throw();
  });

  it("throws an error when invalid argument was passed", function() {
    expect(() => StellarBase.Memo.id()).to.throw(/Expects a int64/);
    expect(() => StellarBase.Memo.id({})).to.throw(/Expects a int64/);
    expect(() => StellarBase.Memo.id(Infinity)).to.throw(/Expects a int64/);
    expect(() => StellarBase.Memo.id(NaN)).to.throw(/Expects a int64/);
    expect(() => StellarBase.Memo.id("test")).to.throw(/Expects a int64/);
  });
});

describe("Memo.hash()", function() {
  it("returns a value for a correct argument", function() {
    expect(() => StellarBase.Memo.hash(new Buffer(32))).to.not.throw();
  });

  it("throws an error when invalid argument was passed", function() {
    expect(() => StellarBase.Memo.hash()).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash({})).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash(Infinity)).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash(NaN)).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash("test")).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash([0, 10, 20])).to.throw(/Expects a 32 byte hash value/);
    expect(() => StellarBase.Memo.hash(new Buffer(33))).to.throw(/Expects a 32 byte hash value/);
  });
});
