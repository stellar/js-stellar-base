

describe("Memo.text()", function() {

  it("returns a value for a correct argument", function() {
    expect(() => StellarBase.Memo.text("test")).to.not.throw();
    let memoUtf8 = StellarBase.Memo.text("三代之時")

    // Node 0.10, sigh...
    let equal = true;
    let a = new Buffer(memoUtf8._value, "utf8");
    let b = new Buffer("三代之時", "utf8");
    if (a.length !== b.length) {
        equal = false;
    } else {
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                equal = false;
                break;
            }
        }
    }

    expect(equal).to.be.true
  });

  it("throws an error when invalid argument was passed", function() {
    expect(() => StellarBase.Memo.text()).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text({})).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(10)).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(Infinity)).to.throw(/Expects string/);
    expect(() => StellarBase.Memo.text(NaN)).to.throw(/Expects string/);
  });

  it("throws an error when string is longer than 28 bytes", function() {
    expect(() => StellarBase.Memo.text("12345678901234567890123456789")).to.throw(/Text should be/);
    expect(() => StellarBase.Memo.text("三代之時三代之時三代之時")).to.throw(/Text should be/);
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

describe("Memo.hash() & Memo.returnHash()", function() {
  var methods = [StellarBase.Memo.hash, StellarBase.Memo.returnHash];

  it("returns a value for a correct argument", function() {
    for (let i in methods) {
      let method = methods[i];
      expect(() => method(new Buffer(32))).to.not.throw();
      expect(() => method('0000000000000000000000000000000000000000000000000000000000000000')).to.not.throw();
    }
  });

  it("throws an error when invalid argument was passed", function() {
    for (let i in methods) {
      let method = methods[i];
      expect(() => method()).to.throw(/Expects a 32 byte hash value/);
      expect(() => method({})).to.throw(/Expects a 32 byte hash value/);
      expect(() => method(Infinity)).to.throw(/Expects a 32 byte hash value/);
      expect(() => method(NaN)).to.throw(/Expects a 32 byte hash value/);
      expect(() => method("test")).to.throw(/Expects a 32 byte hash value/);
      expect(() => method([0, 10, 20])).to.throw(/Expects a 32 byte hash value/);
      expect(() => method(new Buffer(33))).to.throw(/Expects a 32 byte hash value/);
      expect(() => method('00000000000000000000000000000000000000000000000000000000000000')).to.throw(/Expects a 32 byte hash value/);
      expect(() => method('000000000000000000000000000000000000000000000000000000000000000000')).to.throw(/Expects a 32 byte hash value/);
    }
  });
});
