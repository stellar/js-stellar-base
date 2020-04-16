describe('FeeBumpTransaction', function() {
  it('constructs a FeeBumTransaction object from a TransactionEnvelope', function() {
    let baseFee = '100';
    const networkPassphrase = 'Standalone Network ; February 2017';
    const innerSource = StellarBase.Keypair.master(networkPassphrase);
    const innerAccount = new StellarBase.Account(innerSource.publicKey(), '7');
    const destination =
      'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
    const amount = '2000.0000000';
    const asset = StellarBase.Asset.native();

    let innerTx = new StellarBase.TransactionBuilder(innerAccount, {
      fee: '100',
      networkPassphrase: networkPassphrase,
      timebounds: {
        minTime: 0,
        maxTime: 0
      },
      v1: true
    })
      .addOperation(
        StellarBase.Operation.payment({
          destination,
          asset,
          amount
        })
      )
      .addMemo(StellarBase.Memo.text('Happy birthday!'))
      .build();
    innerTx.sign(innerSource);

    let feeSource = StellarBase.Keypair.fromSecret(
      'SB7ZMPZB3YMMK5CUWENXVLZWBK4KYX4YU5JBXQNZSK2DP2Q7V3LVTO5V'
    );

    let transaction = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
      feeSource,
      '100',
      innerTx,
      networkPassphrase
    );

    transaction.sign(feeSource);
    expect(transaction.feeSource).to.be.equal(feeSource.publicKey());
    expect(transaction.fee).to.be.equal('200');

    const innerTransaction = transaction.innerTransaction;

    expect(innerTransaction.toXDR()).to.be.equal(innerTx.toXDR());
    expect(innerTransaction.source).to.be.equal(innerSource.publicKey());
    expect(innerTransaction.fee).to.be.equal('100');
    expect(innerTransaction.memo.type).to.be.equal(StellarBase.MemoText);
    expect(innerTransaction.memo.value.toString('ascii')).to.be.equal(
      'Happy birthday!'
    );
    let operation = innerTransaction.operations[0];
    expect(operation.type).to.be.equal('payment');
    expect(operation.destination).to.be.equal(destination);
    expect(operation.amount).to.be.equal(amount);

    const expectedXDR =
      'AAAABQAAAADgSJG2GOUMy/H9lHyjYZOwyuyytH8y0wWaoc596L+bEgAAAAAAAADIAAAAAgAAAABzdv3ojkzWHMD7KUoXhrPx0GH18vHKV0ZfqpMiEblG1gAAAGQAAAAAAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA9IYXBweSBiaXJ0aGRheSEAAAAAAQAAAAAAAAABAAAAAOBIkbYY5QzL8f2UfKNhk7DK7LK0fzLTBZqhzn3ov5sSAAAAAAAAAASoF8gAAAAAAAAAAAERuUbWAAAAQK933Dnt1pxXlsf1B5CYn81PLxeYsx+MiV9EGbMdUfEcdDWUySyIkdzJefjpR5ejdXVp/KXosGmNUQ+DrIBlzg0AAAAAAAAAAei/mxIAAABAijIIQpL6KlFefiL4FP8UWQktWEz4wFgGNSaXe7mZdVMuiREntehi1b7MRqZ1h+W+Y0y+Z2HtMunsilT2yS5mAA==';

    expect(
      transaction
        .toEnvelope()
        .toXDR()
        .toString('base64')
    ).to.be.equal(expectedXDR);
    let expectedTxEnvelope = StellarBase.xdr.TransactionEnvelope.fromXDR(
      expectedXDR,
      'base64'
    ).value();

    expect(innerTransaction.source).to.equal(
      StellarBase.StrKey.encodeEd25519PublicKey(
        expectedTxEnvelope
          .tx()
          .innerTx()
          .value()
          .tx()
          .sourceAccount()
          .ed25519()
      )
    );
    expect(transaction.feeSource).to.equal(
      StellarBase.StrKey.encodeEd25519PublicKey(
        expectedTxEnvelope
          .tx()
          .feeSource()
          .ed25519()
      )
    );

    expect(transaction.innerTransaction.fee).to.equal(
      expectedTxEnvelope
        .tx()
        .innerTx()
        .value()
        .tx()
        .fee()
        .toString()
    );
    expect(transaction.fee).to.equal(
      expectedTxEnvelope
        .tx()
        .fee()
        .toString()
    );

    expect(innerTransaction.signatures.length).to.equal(1);
    expect(innerTransaction.signatures[0].toXDR().toString('base64')).to.equal(
      expectedTxEnvelope
        .tx()
        .innerTx()
        .value()
        .signatures()[0]
        .toXDR()
        .toString('base64')
    );

    expect(transaction.signatures.length).to.equal(1);
    expect(transaction.signatures[0].toXDR().toString('base64')).to.equal(
      expectedTxEnvelope
        .signatures()[0]
        .toXDR()
        .toString('base64')
    );
  });
});
