describe('Account.constructor', function() {
  it('fails to create Account object from an invalid address', function() {
    expect(() => new StellarBase.Account('GBBB')).to.throw(
      /accountId is invalid/
    );
  });

  it('fails to create Account object from an invalid sequence number', function() {
    expect(
      () =>
        new StellarBase.Account(
          'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
          100
        )
    ).to.throw(/sequence must be of type string/);
  });

  it('creates an Account object', function() {
    let account = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '100'
    );
    expect(account.accountId()).to.equal(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB'
    );
    expect(account.sequenceNumber()).to.equal('100');
  });
});

describe('Account.incrementSequenceNumber', function() {
  it('correctly increments the sequence number', function() {
    let account = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '100'
    );
    account.incrementSequenceNumber();
    expect(account.sequenceNumber()).to.equal('101');
    account.incrementSequenceNumber();
    account.incrementSequenceNumber();
    expect(account.sequenceNumber()).to.equal('103');
  });
});

// describe('Defines the MuxedAccount abstraction', function() {
//   let account1 = StellarBase.MuxedAccount.fromPublicKey(
//     'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB');

//   let account2 = StellarBase.MuxedAccount.fromMuxedKey(
//     'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK');

//   it('IDs can be get/set properly', function() {
//     expect(account1.getId()).to.equal(0);
//     account1.setId(1234);
//     expect(account1.getId()).to.equal(1234);
//     expect(account2.getPublicKey()).to.equal(account1.getPublicKey());
//   });

//   let account3 = StellarBase.MuxedAccount.fromPublicKey(
//     'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
//     12345678);

//   it('entire address is built correctly', function() {
//     expect(account3.getAddress()).to.equal(account2.getAddress());
//   });

//   it('subaccounts can be created', function() {
//     let account4 = account3.withNewId(87654321);
//     expect(account3.getId()).to.equal(12345678);
//     expect(account4.getPublicKey()).to.equal(account3.getPublicKey());
//     expect(account4.getId()).to.equal(87654321);
//   });

//   it('underlying XDR is valid', function() {

//   })
// });
