describe('Account.constructor', function () {
  const ACCOUNT = 'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB';
  const MUXED_ADDRESS =
    'MA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVAAAAAAAAAAAAAJLK';
  const UNDERLYING_ACCOUNT =
    'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVSGZ';

  it('fails to create Account object from an invalid address', function () {
    expect(() => new StellarBase.Account('GBBB')).to.throw(
      /accountId is invalid/
    );
  });

  it('fails to create Account object from an invalid sequence number', function () {
    expect(() => new StellarBase.Account(ACCOUNT, 100)).to.throw(
      /sequence must be of type string/
    );
    expect(() => new StellarBase.Account(ACCOUNT, 'not a number')).to.throw(
      /not a number/
    );
  });

  it('creates an Account object', function () {
    let account = new StellarBase.Account(ACCOUNT, '100');
    expect(account.accountId()).to.equal(ACCOUNT);
    expect(account.sequenceNumber()).to.equal('100');
  });

  it('wont create Account objects from muxed account strings', function () {
    expect(() => {
      new StellarBase.Account(MUXED_ADDRESS, '123');
    }).to.throw(/MuxedAccount/);
  });
});

describe('Account.incrementSequenceNumber', function () {
  it('correctly increments the sequence number', function () {
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
