

describe('Keypair.fromSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36";
    let kp = StellarBase.Keypair.fromSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("GDFQVQCYYB7GKCGSCUSIQYXTPLV5YJ3XWDMWGQMDNM4EAXAL7LITIBQ7");
    expect(kp.seed()).to.eql(seed);
  });

  it("throw an error if the arg isn't strkey encoded as a seed", function() {

    expect(() => StellarBase.Keypair.fromSeed("hel0")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("SBWUBZ3SIPLLF5CCXLWUB2Z6UBTYAW34KVXOLRQ5HDAZG4ZY7MHNBWJ1")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu")).to.throw()

  });

});

describe('Keypair.fromRawSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "masterpassphrasemasterpassphrase";
    let kp = StellarBase.Keypair.fromRawSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
    expect(kp.seed()).to.eql("SBWWC43UMVZHAYLTONYGQ4TBONSW2YLTORSXE4DBONZXA2DSMFZWLP2R");
    expect(kp.rawPublicKey().toString("hex")).to.eql("2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432");
  });

  it("throws an error if the arg isn't 32 bytes", function() {
    expect(() => StellarBase.Keypair.fromSeed("masterpassphrasemasterpassphras")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("masterpassphrasemasterpassphrase1")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed(null)).to.throw()
    expect(() => StellarBase.Keypair.fromSeed()).to.throw()
  });

});


describe('Keypair.fromAddress', function() {

  it("creates a keypair correctly", function() {
    let kp = StellarBase.Keypair.fromAddress("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
    expect(kp.rawPublicKey().toString("hex")).to.eql("2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432");
  });

  it("throw an error if the arg isn't strkey encoded as a accountid", function() {
    expect(() => StellarBase.Keypair.fromAddress("hel0")).to.throw()
    expect(() => StellarBase.Keypair.fromAddress("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromAddress("sfyjodTxbwLtRToZvi6yQ1KnpZriwTJ7n6nrASFR6goRviCU3Ff")).to.throw()

  });

});


describe('Keypair.random', function() {

  it("creates a keypair correctly", function() {
    let kp = StellarBase.Keypair.random();
    expect(kp).to.be.instanceof(StellarBase.Keypair);
  });

});
