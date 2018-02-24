
describe("FederationResponse.constructor()", function() {
  it("throws error when address is invalid", function() {
    expect(() => new StellarBase.FederationResponse(
      "test",
      "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA")
    ).to.throw(/Expects a stellar address/);
  });
  it("throws error when accountid is invalid", function() {
    expect(() => new StellarBase.FederationResponse(
      "hugo*example.com",
      "GINVALIDINVALIDINVALID")
    ).to.throw(/accountId is invalid/);
  });
});

describe("FederationResponse.stellarAddress", function() {
  it("returns a value for a correct argument", function() {
    let fedResp = new StellarBase.FederationResponse(
      "hugo*example.com",
      "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA"
    );
    expect(fedResp.stellarAddress).to.be.equal('hugo*example.com');
  });

  it("converts to/from xdr object", function() {
    let origFedResp = new StellarBase.FederationResponse(
      "hugo*example.com",
      "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA"
    );
    let fedResp = origFedResp.toXDRObject();
    expect(fedResp.stellarAddress()).to.be.equal('hugo*example.com');

    let baseFedResp = StellarBase.FederationResponse.fromXDRObject(fedResp);
    expect(baseFedResp.stellarAddress).to.be.equal('hugo*example.com');
    expect(baseFedResp.accountId).to.be.equal('GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA');
  });

  it("can be signed", function() {
    let secret = "SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36";
    let kp = StellarBase.Keypair.fromSecret(secret);
    let fedResp = new StellarBase.FederationResponse(
      "hugo*example.com",
      "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA"
    );
    expect(fedResp.sign(kp).toString("base64")).to.be.equal('p0UqwQrPaO5CePMIM4APezan5Zydw+S1kWuX+Tid0fEmrQqJAuXPQKxBQHA71ZF9t/JYd+2/eGUBtSuanm2zBg==');
    let fedResp2 = new StellarBase.FederationResponse(
      "szil*example.com",
      "GBV5QCPOXI2AU2TKEMDIYUTSXQ7GZ6JZVCKMXV7NDBE3TYKFOJ5KMTHZ",
      StellarBase.Memo.text("test")
    );
    let secret2 = "SBGHL762R7UWD6QDTVNUUFU445DVBS5UANADTL5W56OMW5R2YWUDKWJJ";
    let key2 = StellarBase.Keypair.fromSecret(secret2);
    expect(fedResp2.sign(key2).toString("base64")).to.be.equal("YtvWDVlbye1CXK+oeESjR0HRvHiAAWaAnJnXochGQXi7i0MKKVHwyC03Q3fLMcW4iB9W/EWkqacZtCuVv3dLAQ==");
  });

  it("can be verified", function() {
    let pub = "GDFQVQCYYB7GKCGSCUSIQYXTPLV5YJ3XWDMWGQMDNM4EAXAL7LITIBQ7";
    let kp = StellarBase.Keypair.fromPublicKey(pub);
    let fedResp = new StellarBase.FederationResponse(
      "hugo*example.com",
      "GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA"
    );
    let signature = Buffer.from('p0UqwQrPaO5CePMIM4APezan5Zydw+S1kWuX+Tid0fEmrQqJAuXPQKxBQHA71ZF9t/JYd+2/eGUBtSuanm2zBg==');
    expect(fedResp.verify(kp, signature)).to.be.truthy;
  })
});
