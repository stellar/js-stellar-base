

describe('Keypair.fromSeed', function() {

  it("creates a keypair correctly", function() {
    let seed = "SD7X7LEHBNMUIKQGKPARG5TDJNBHKC346OUARHGZL5ITC6IJPXHILY36";
    let kp = StellarBase.Keypair.fromSeed(seed);

    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.accountId()).to.eql("GDFQVQCYYB7GKCGSCUSIQYXTPLV5YJ3XWDMWGQMDNM4EAXAL7LITIBQ7");
    expect(kp.seed()).to.eql(seed);
  });

  it("throw an error if the arg isn't strkey encoded as a seed", function() {

    expect(() => StellarBase.Keypair.fromSeed("hel0")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("SBWUBZ3SIPLLF5CCXLWUB2Z6UBTYAW34KVXOLRQ5HDAZG4ZY7MHNBWJ1")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromSeed("gsYRSEQhTffqA9opPepAENCr2WG6z5iBHHubxxbRzWaHf8FBWcu")).to.throw()

  });

});

describe('Keypair.fromSeed', function() {

  it("creates a keypair correctly", function() {
    let keys = [
      {
        oldSeed: 's3wpFU2RY8EyYRDKxhWNj3wJFBd4qHLKnaccXw9uGyYwrWVLDkB',
        newSeed: 'SCCMVPLGK4NLKPGGMYD4ANCC4VXMXKD7RTA24EIJ2Y6NMCCP5WJQ2TXB',
        newAddress: 'GDF7RAKSHWC5GKY2NRLYTZTBGFES5WX5Q6PRLX4VGH7X6TGLHLRPFIGD'
      },
      {
        oldSeed: 's3Gj77MCTCDGggmr3ExjjEMX814jCgWD4wZzjo6PiprPk7uKu6w',
        newSeed: 'SCJ7PY5AITP6NBXPEFSB52BH7JQYJ3GPAMXBMMT6ISY2VOSEXNNGVHHH',
        newAddress: 'GDBAERNWWNLSZCDHTKP34N7CJHE47IRK74WAY3ZHE33ERVLB2FNTM34J'
      },
      {
        oldSeed: 'sfYffC9uMbEoV3FiFZpnUrKyVLL89AT5QVpPsTpCFsz8w9oMbLw',
        newSeed: 'SAZS3RDL5QTPJSWARQ4MWLIKKXM446VKBBYXBXBUCXGKJCCH72TVUC6U',
        newAddress: 'GCIQKXYV3OLMYUU72C32LNC766TS5LY6O3MXPP5WY2XICB4G3OPYXRGP'
      },
      {
        oldSeed: 's37qzijJQNy7MqPQyZJY8zFmiEzszjpBVP9CZMXJJiPmmrxdPj8',
        newSeed: 'SCXXRH5QY6DAQOQNHMMF5PBKPB732US6QFNI7722VDRUCNJ5MNFDJJJL',
        newAddress: 'GAPVNVE4S2ZKPWYM6SWPVNNYPQUTBQXNKOSIPJ3LRQWJTREP5CDLXG2B'
      },
      {
        oldSeed: 's3StuXjYd8Hrgyy8WyG5aSRmDDebJZ2oTgPcGADbi4qRXThPBL4',
        newSeed: 'SCVQWNPUXGDRW2IOOM6SS5NQB4KK3Z2MH7ZMM4O6CXKX5L3NRZ5E6V2J',
        newAddress: 'GBNBJUKKTC4TZFB5QY5CXNC7UPOAYIW3DKWSSHJXXWKBDV7CZIFPBAMN'
      }
    ];


    for (let i in keys) {
      let key = keys[i];
      let keyPair = StellarBase.Keypair.fromBase58Seed(key.oldSeed);
      expect(keyPair.seed()).to.equal(key.newSeed);
      expect(keyPair.accountId()).to.equal(key.newAddress);
    }
  });

  it("throw an error if the arg isn't strkey encoded as a seed", function() {

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
    expect(kp.accountId()).to.eql("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
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


describe('Keypair.fromAccountId', function() {

  it("creates a keypair correctly", function() {
    let kp = StellarBase.Keypair.fromAccountId("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
    expect(kp).to.be.instanceof(StellarBase.Keypair);
    expect(kp.accountId()).to.eql("GAXDYNIBA5E4DXR5TJN522RRYESFQ5UNUXHIPTFGVLLD5O5K552DF5ZH");
    expect(kp.rawPublicKey().toString("hex")).to.eql("2e3c35010749c1de3d9a5bdd6a31c12458768da5ce87cca6aad63ebbaaef7432");
  });

  it("throw an error if the arg isn't strkey encoded as a accountid", function() {
    expect(() => StellarBase.Keypair.fromAccountId("hel0")).to.throw()
    expect(() => StellarBase.Keypair.fromAccountId("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromAccountId("sfyjodTxbwLtRToZvi6yQ1KnpZriwTJ7n6nrASFR6goRviCU3Ff")).to.throw()
  });

  it("throws an error if the address isn't 32 bytes", function() {
    expect(() => StellarBase.Keypair.fromAccountId("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromAccountId("masterpassphrasemasterpassphrase")).to.throw()
    expect(() => StellarBase.Keypair.fromAccountId(null)).to.throw()
    expect(() => StellarBase.Keypair.fromAccountId()).to.throw()
  });

});


describe('Keypair.random', function() {

  it("creates a keypair correctly", function() {
    let kp = StellarBase.Keypair.random();
    expect(kp).to.be.instanceof(StellarBase.Keypair);
  });

});

describe('Keypair.isValidPublicKey', function() {

  it("returns true for valid public key", function() {
    var keys = [
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      'GB7KKHHVYLDIZEKYJPAJUOTBE5E3NJAXPSDZK7O6O44WR3EBRO5HRPVT',
      'GD6WVYRVID442Y4JVWFWKWCZKB45UGHJAABBJRS22TUSTWGJYXIUR7N2',
      'GBCG42WTVWPO4Q6OZCYI3D6ZSTFSJIXIS6INCIUF23L6VN3ADE4337AP',
      'GDFX463YPLCO2EY7NGFMI7SXWWDQAMASGYZXCG2LATOF3PP5NQIUKBPT',
      'GBXEODUMM3SJ3QSX2VYUWFU3NRP7BQRC2ERWS7E2LZXDJXL2N66ZQ5PT',
      'GAJHORKJKDDEPYCD6URDFODV7CVLJ5AAOJKR6PG2VQOLWFQOF3X7XLOG',
      'GACXQEAXYBEZLBMQ2XETOBRO4P66FZAJENDHOQRYPUIXZIIXLKMZEXBJ',
      'GDD3XRXU3G4DXHVRUDH7LJM4CD4PDZTVP4QHOO4Q6DELKXUATR657OZV',
      'GDTYVCTAUQVPKEDZIBWEJGKBQHB4UGGXI2SXXUEW7LXMD4B7MK37CWLJ'
    ];

    for (var i in keys) {
      expect(StellarBase.Keypair.isValidPublicKey(keys[i])).to.be.true;
    }
  });

  it("returns false for invalid public key", function() {
    var keys = [
      'GBPXX0A5N4JYPESHAADMQKBPWZWQDQ64ZV6ZL2S3LAGW4SY7NTCMWIVL',
      'GCFZB6L25D26RQFDWSSBDEYQ32JHLRMTT44ZYE3DZQUTYOL7WY43PLBG++',
      'GADE5QJ2TY7S5ZB65Q43DFGWYWCPHIYDJ2326KZGAGBN7AE5UY6JVDRRA',
      'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2',
      'GB6OWYST45X57HCJY5XWOHDEBULB6XUROWPIKW77L5DSNANBEQGUPADT2T',
      'GDXIIZTKTLVYCBHURXL2UPMTYXOVNI7BRAEFQCP6EZCY4JLKY4VKFNLT',
      'gWRYUerEKuz53tstxEuR3NCkiQDcV4wzFHmvLnZmj7PUqxW2wt',
      'test',
      'g4VPBPrHZkfE8CsjuG2S4yBQNd455UWmk' // Old network key
    ];

    for (var i in keys) {
      expect(StellarBase.Keypair.isValidPublicKey(keys[i])).to.be.false;
    }
  });

});
