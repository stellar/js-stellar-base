

describe('Keypair.fromSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "SBWUBZ3SIPLLF5CCXLWUB2Z6UBTYAW34KVXOLRQ5HDAZG4ZY7MHNBWJO";
    let kp = StellarBase.Keypair.fromSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("GB4SMIWQKNQIVY4BX5LPGSW3EPR23CFE3EWIL3UPOT5L3ATHWIGMGKYJ");
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
    let kp = StellarBase.Keypair.fromAddress("GAEW2L7KXHCTNGX6SVHQS3QOP3GOSKQPWLD75WYT2C3VKHYQ5TXBJLBD");
    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("GAEW2L7KXHCTNGX6SVHQS3QOP3GOSKQPWLD75WYT2C3VKHYQ5TXBJLBD");
    expect(kp.rawPublicKey().toString("hex")).to.eql("096d2feab9c5369afe954f096e0e7ecce92a0fb2c7fedb13d0b7551f10ecee14");
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
