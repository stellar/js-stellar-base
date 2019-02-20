import crypto from 'crypto';

describe('Transaction', function() {
  it('constructs Transaction object from a TransactionEnvelope', function(done) {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000.0000000';

    let input = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .setTimeout(StellarBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new StellarBase.Transaction(input);
    var operation = transaction.operations[0];

    expect(transaction.source).to.be.equal(source.accountId());
    expect(transaction.fee).to.be.equal(100);
    expect(transaction.memo.type).to.be.equal(StellarBase.MemoText);
    expect(transaction.memo.value.toString('ascii')).to.be.equal(
      'Happy birthday!'
    );
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal(destination);
    expect(operation.amount).to.be.equal(amount);

    done();
  });

  beforeEach(function() {
    StellarBase.Network.useTestNetwork();
  });

  afterEach(function() {
    StellarBase.Network.use(null);
  });

  it('does not sign when no Network selected', function() {
    StellarBase.Network.use(null);
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';
    let signer = StellarBase.Keypair.random();

    let tx = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    expect(() => tx.sign(signer)).to.throw(/No network selected/);
  });

  it('signs correctly', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';
    let signer = StellarBase.Keypair.master();

    let tx = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    tx.sign(signer);

    let env = tx.toEnvelope();

    let rawSig = env.signatures()[0].signature();
    let verified = signer.verify(tx.hash(), rawSig);
    expect(verified).to.equal(true);
  });

  it('signs using hash preimage', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let preimage = crypto.randomBytes(64);
    let hash = crypto
      .createHash('sha256')
      .update(preimage)
      .digest();

    let tx = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();
    tx.signHashX(preimage);

    let env = tx.toEnvelope();
    expectBuffersToBeEqual(env.signatures()[0].signature(), preimage);
    expectBuffersToBeEqual(
      env.signatures()[0].hint(),
      hash.slice(hash.length - 4)
    );
  });

  it('returns error when signing using hash preimage that is too long', function() {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let preimage = crypto.randomBytes(2 * 64);
    let hash = crypto
      .createHash('sha256')
      .update(preimage)
      .digest();

    let tx = new StellarBase.TransactionBuilder(source, { fee: 100 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .setTimeout(StellarBase.TimeoutInfinite)
      .build();

    expect(() => tx.signHashX(preimage)).to.throw(
      /preimage cannnot be longer than 64 bytes/
    );
  });

  it('accepts 0 as a valid transaction fee', function(done) {
    let source = new StellarBase.Account(
      'GBBM6BKZPEHWYO3E3YKREDPQXMS4VK35YLNU7NFBRI26RAN7GI5POFBB',
      '0'
    );
    let destination =
      'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
    let asset = StellarBase.Asset.native();
    let amount = '2000';

    let input = new StellarBase.TransactionBuilder(source, { fee: 0 })
      .addOperation(
        StellarBase.Operation.payment({ destination, asset, amount })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .setTimeout(StellarBase.TimeoutInfinite)
      .build()
      .toEnvelope()
      .toXDR('base64');

    var transaction = new StellarBase.Transaction(input);
    var operation = transaction.operations[0];

    expect(transaction.fee).to.be.equal(0);

    done();
  });

  it('outputs xdr as a string', () => {
    const xdrString =
      'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
    const transaction = new StellarBase.Transaction(xdrString);
    expect(typeof transaction).to.be.equal('object');
    expect(typeof transaction.toXDR).to.be.equal('function');
    expect(transaction.toXDR()).to.be.equal(xdrString);
  });
});

function expectBuffersToBeEqual(left, right) {
  let leftHex = left.toString('hex');
  let rightHex = right.toString('hex');
  expect(leftHex).to.eql(rightHex);
}
