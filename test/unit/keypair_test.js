

describe('Keypair.fromSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "s9aaUNPaT9t1x7vCeDzQYvLZDm5XxSUKkwnqQowV6D3kMr678uZ";
    let kp = StellarBase.Keypair.fromSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu");
    expect(kp.seed()).to.eql(seed);
  });

  it("throw an error if the arg isn't base58check encoded as a seed", function() {

    expect(() => StellarBase.Keypair.fromSeed("hel0")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu")).to.throw()

  });

});

describe('Keypair.fromRawSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "masterpassphrasemasterpassphrase";
    let kp = StellarBase.Keypair.fromRawSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("gM4gu1GLe3vm8LKFfRJcmTt1eaEuQEbo61a8BVkGcou78m21K7");
    expect(kp.seed()).to.eql("sfyjodTxbwLtRToZvi6yQ1KnpZriwTJ7n6nrASFR6goRviCU3Ff");
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
    let kp = StellarBase.Keypair.fromAddress("gM4gu1GLe3vm8LKFfRJcmTt1eaEuQEbo61a8BVkGcou78m21K7");
    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.address()).to.eql("gM4gu1GLe3vm8LKFfRJcmTt1eaEuQEbo61a8BVkGcou78m21K7");
    expect(kp.rawPublicKey().toString("hex")).to.eql("2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432");
  });

  it("throw an error if the arg isn't base58check encoded as a accountid", function() {

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
