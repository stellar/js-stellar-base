describe('Account.constructor', function() {
  const ADDRESS = 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
  const MUXED_ADDRESS =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK';

  it('fails to create Account object from an invalid address', function() {
    expect(() => new StellarBase.Account('GBBB')).to.throw(
      /accountId is invalid/
    );
  });

  it('fails to create Account object from an invalid sequence number', function() {
    expect(() => new StellarBase.Account(ADDRESS, 100)).to.throw(
      /sequence must be of type string/
    );
  });

  it('creates an Account object', function() {
    let account = new StellarBase.Account(ADDRESS, '100');
    expect(account.accountId()).to.equal(ADDRESS);
    expect(account.sequenceNumber()).to.equal('100');
  });

  it('creates Account objects from muxed account strings', function() {
    let account = new StellarBase.Account(MUXED_ADDRESS, '123');
    expect(account.accountId()).to.equal(MUXED_ADDRESS);
    expect(account.sequenceNumber()).to.equal('123');
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
