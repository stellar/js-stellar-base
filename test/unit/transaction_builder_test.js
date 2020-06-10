import { isValidDate } from '../../src/transaction_builder.js';

describe('TransactionBuilder', function() {
  describe('constructs a native payment transaction with one operation', function() {
    var source;
    var destination;
    var amount;
    var asset;
    var transaction;
    var memo;
    beforeEach(function() {
      source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      destination = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount = '1000';
      asset = StellarBase.Asset.native();
      memo = StellarBase.Memo.id('100');

      transaction = new StellarBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination: destination,
            asset: asset,
            amount: amount
          })
        )
        .addMemo(memo)
        .setTimeout(StellarBase.TimeoutInfinite)
        .build();
    });

    it('should have the same source account', function(done) {
      expect(transaction.source).to.be.equal(source.accountId());
      done();
    });

    it('should have the incremented sequence number', function(done) {
      expect(transaction.sequence).to.be.equal('1');
      done();
    });

    it("should increment the account's sequence number", function(done) {
      expect(source.sequenceNumber()).to.be.equal('1');
      done();
    });

    it('should have one payment operation', function(done) {
      expect(transaction.operations.length).to.be.equal(1);
      expect(transaction.operations[0].type).to.be.equal('payment');
      done();
    });

    it('should have 100 stroops fee', function(done) {
      expect(transaction.fee).to.be.equal('100');
      done();
    });
  });

  describe('constructs a native payment transaction with two operations', function() {
    var source;
    var destination1;
    var amount1;
    var destination2;
    var amount2;
    var asset;
    var transaction;
    beforeEach(function() {
      asset = StellarBase.Asset.native();
      source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );

      destination1 = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount1 = '1000';
      destination2 = 'GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2';
      amount2 = '2000';

      transaction = new StellarBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination: destination1,
            asset: asset,
            amount: amount1
          })
        )
        .addOperation(
          StellarBase.Operation.payment({
            destination: destination2,
            asset: asset,
            amount: amount2
          })
        )
        .setTimeout(StellarBase.TimeoutInfinite)
        .build();
    });

    it('should have the same source account', function(done) {
      expect(transaction.source).to.be.equal(source.accountId());
      done();
    });

    it('should have the incremented sequence number', function(done) {
      expect(transaction.sequence).to.be.equal('1');
      done();
    });

    it("should increment the account's sequence number", function(done) {
      expect(source.sequenceNumber()).to.be.equal('1');
      done();
    });

    it('should have two payment operation', function(done) {
      expect(transaction.operations.length).to.be.equal(2);
      expect(transaction.operations[0].type).to.be.equal('payment');
      expect(transaction.operations[1].type).to.be.equal('payment');
      done();
    });

    it('should have 200 stroops fee', function(done) {
      expect(transaction.fee).to.be.equal('200');
      done();
    });
  });

  describe('constructs a native payment transaction with custom base fee', function() {
    var source;
    var destination1;
    var amount1;
    var destination2;
    var amount2;
    var asset;
    var transaction;
    beforeEach(function() {
      asset = StellarBase.Asset.native();
      source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );

      destination1 = 'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2';
      amount1 = '1000';
      destination2 = 'GC6ACGSA2NJGD6YWUNX2BYBL3VM4MZRSEU2RLIUZZL35NLV5IAHAX2E2';
      amount2 = '2000';

      transaction = new StellarBase.TransactionBuilder(source, {
        fee: 1000,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination: destination1,
            asset: asset,
            amount: amount1
          })
        )
        .addOperation(
          StellarBase.Operation.payment({
            destination: destination2,
            asset: asset,
            amount: amount2
          })
        )
        .setTimeout(StellarBase.TimeoutInfinite)
        .build();
    });

    it('should have 2000 stroops fee', function(done) {
      expect(transaction.fee).to.be.equal('2000');
      done();
    });
  });

  describe('constructs a native payment transaction with integer timebounds', function() {
    it('should have have timebounds', function(done) {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let timebounds = {
        minTime: '1455287522',
        maxTime: '1455297545'
      };
      let transaction = new StellarBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: StellarBase.Asset.native(),
            amount: '1000'
          })
        )
        .build();

      expect(transaction.timeBounds.minTime).to.be.equal(timebounds.minTime);
      expect(transaction.timeBounds.maxTime).to.be.equal(timebounds.maxTime);
      done();
    });
  });

  describe('distinguishes whether a provided Date is valid or invalid', function() {
    it('should accept empty Date objects', function(done) {
      let d = new Date();
      expect(isValidDate(d)).to.be.true;
      done();
    });
    it('should accept configured Date objects', function(done) {
      let d = new Date(1455287522000);
      expect(isValidDate(d)).to.be.true;
      done();
    });
    it('should reject mis-configured Date objects', function(done) {
      let d = new Date('bad string here');
      expect(isValidDate(d)).to.be.false;
      done();
    });
    it('should reject objects that are not Dates', function(done) {
      let d = [1455287522000];
      expect(isValidDate(d)).to.be.false;
      done();
    });
  });

  describe('constructs a native payment transaction with date timebounds', function() {
    it('should have expected timebounds', function(done) {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let timebounds = {
        minTime: new Date(1528145519000),
        maxTime: new Date(1528231982000)
      };

      let transaction = new StellarBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: StellarBase.Asset.native(),
            amount: '1000'
          })
        )
        .build();

      // getTime returns milliseconds, but we store seconds internally
      let expectedMinTime = timebounds.minTime.getTime() / 1000;
      let expectedMaxTime = timebounds.maxTime.getTime() / 1000;
      expect(transaction.timeBounds.minTime).to.be.equal(
        expectedMinTime.toString()
      );
      expect(transaction.timeBounds.maxTime).to.be.equal(
        expectedMaxTime.toString()
      );
      done();
    });
  });
  describe('timebounds', function() {
    it('requires maxTime', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new StellarBase.TransactionBuilder(source, {
          timebounds: {
            minTime: '0'
          },
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
    it('requires minTime', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new StellarBase.TransactionBuilder(source, {
          timebounds: {
            maxTime: '10'
          },
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
    it('works with timebounds defined', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new StellarBase.TransactionBuilder(source, {
          timebounds: {
            minTime: '1',
            maxTime: '10'
          },
          fee: 100,
          networkPassphrase: StellarBase.Networks.TESTNET
        }).build();
      }).to.not.throw();
    });
    it('fails with empty timebounds', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new StellarBase.TransactionBuilder(source, {
          timebounds: {},
          fee: 100
        }).build();
      }).to.throw(
        'TimeBounds has to be set or you must call setTimeout(TimeoutInfinite).'
      );
    });
  });
  describe('setTimeout', function() {
    it('not called', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new StellarBase.TransactionBuilder(source, {
        fee: 100
      }).addOperation(
        StellarBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: StellarBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.build()).to.throw(
        /TimeBounds has to be set/
      );
      expect(source.sequenceNumber()).to.be.equal('0');
    });

    it('timeout negative', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new StellarBase.TransactionBuilder(source, {
        fee: 100
      }).addOperation(
        StellarBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: StellarBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.setTimeout(-1)).to.throw(
        /timeout cannot be negative/
      );
      expect(source.sequenceNumber()).to.be.equal('0');
    });

    it('sets timebounds', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transaction = new StellarBase.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: StellarBase.Asset.native(),
            amount: '1000'
          })
        )
        .setTimeout(10)
        .build();

      let timeoutTimestamp = Math.floor(Date.now() / 1000) + 10;
      expect(transaction.timeBounds.maxTime).to.be.equal(
        timeoutTimestamp.toString()
      );
    });

    it('fails when maxTime already set', function() {
      let timebounds = {
        minTime: '1455287522',
        maxTime: '1455297545'
      };
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transactionBuilder = new StellarBase.TransactionBuilder(source, {
        timebounds,
        fee: 100
      }).addOperation(
        StellarBase.Operation.payment({
          destination:
            'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
          asset: StellarBase.Asset.native(),
          amount: '1000'
        })
      );

      expect(() => transactionBuilder.setTimeout(10)).to.throw(
        /TimeBounds.max_time has been already set/
      );
    });

    it('sets timebounds.maxTime when minTime already set', function() {
      let timebounds = {
        minTime: '1455287522',
        maxTime: '0'
      };
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      let transaction = new StellarBase.TransactionBuilder(source, {
        timebounds,
        fee: 100,
        networkPassphrase: StellarBase.Networks.TESTNET
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination:
              'GDJJRRMBK4IWLEPJGIE6SXD2LP7REGZODU7WDC3I2D6MR37F4XSHBKX2',
            asset: StellarBase.Asset.native(),
            amount: '1000'
          })
        )
        .setTimeout(10)
        .build();

      let timeoutTimestamp = Math.floor(Date.now() / 1000) + 10;
      expect(transaction.timeBounds.maxTime).to.be.equal(
        timeoutTimestamp.toString()
      );
    });
    it('works with TimeoutInfinite', function() {
      let source = new StellarBase.Account(
        'GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGSNFHEYVXM3XOJMDS674JZ',
        '0'
      );
      expect(() => {
        new StellarBase.TransactionBuilder(source, {
          fee: 100,
          networkPassphrase: StellarBase.Networks.TESTNET
        })
          .setTimeout(0)
          .build();
      }).to.not.throw();
    });
  });
  describe('.buildFeeBumpTransaction', function() {
    it('builds a fee bump transaction', function(done) {
      const networkPassphrase = 'Standalone Network ; February 2017';
      const innerSource = StellarBase.Keypair.master(networkPassphrase);
      const innerAccount = new StellarBase.Account(
        innerSource.publicKey(),
        '7'
      );
      const destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      const amount = '2000.0000000';
      const asset = StellarBase.Asset.native();

      let innerTx = new StellarBase.TransactionBuilder(innerAccount, {
        fee: '200',
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination,
            asset,
            amount
          })
        )
        .build();

      let feeSource = StellarBase.Keypair.fromSecret(
        'SB7ZMPZB3YMMK5CUWENXVLZWBK4KYX4YU5JBXQNZSK2DP2Q7V3LVTO5V'
      );
      let transaction = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        innerTx,
        networkPassphrase
      );

      expect(transaction).to.be.an.instanceof(StellarBase.FeeBumpTransaction);

      // The fee rate for fee bump is at least the fee rate of the inner transaction
      expect(() => {
        StellarBase.TransactionBuilder.buildFeeBumpTransaction(
          feeSource,
          '100',
          innerTx,
          networkPassphrase
        );
      }).to.throw(/Invalid baseFee, it should be at least 200 stroops./);

      innerTx = new StellarBase.TransactionBuilder(innerAccount, {
        fee: '80',
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
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

      // The fee rate for fee bump is at least the minimum fee
      expect(() => {
        StellarBase.TransactionBuilder.buildFeeBumpTransaction(
          feeSource,
          '90',
          innerTx,
          networkPassphrase
        );
      }).to.throw(/Invalid baseFee, it should be at least 100 stroops./);

      innerTx = new StellarBase.TransactionBuilder(innerAccount, {
        fee: '100',
        networkPassphrase: networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        }
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination,
            asset,
            amount
          })
        )
        .build();

      const signer = StellarBase.Keypair.master(StellarBase.Networks.TESTNET);
      innerTx.sign(signer);

      const feeBumpTx = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        innerTx,
        networkPassphrase
      );

      const innerTxEnvelope = innerTx.toEnvelope();
      expect(innerTxEnvelope.arm()).to.equal('v1');
      expect(innerTxEnvelope.v1().signatures()).to.have.length(1);

      const v1Tx = innerTxEnvelope.v1().tx();
      const sourceAccountEd25519 = StellarBase.Keypair.fromPublicKey(
        StellarBase.StrKey.encodeEd25519PublicKey(
          v1Tx.sourceAccount().ed25519()
        )
      )
        .xdrAccountId()
        .value();
      const v0Tx = new StellarBase.xdr.TransactionV0({
        sourceAccountEd25519: sourceAccountEd25519,
        fee: v1Tx.fee(),
        seqNum: v1Tx.seqNum(),
        timeBounds: v1Tx.timeBounds(),
        memo: v1Tx.memo(),
        operations: v1Tx.operations(),
        ext: new StellarBase.xdr.TransactionV0Ext(0)
      });
      const innerV0TxEnvelope = new StellarBase.xdr.TransactionEnvelope.envelopeTypeTxV0(
        new StellarBase.xdr.TransactionV0Envelope({
          tx: v0Tx,
          signatures: innerTxEnvelope.v1().signatures()
        })
      );
      expect(innerV0TxEnvelope.v0().signatures()).to.have.length(1);

      const feeBumpV0Tx = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        '200',
        new StellarBase.Transaction(innerV0TxEnvelope, networkPassphrase),
        networkPassphrase
      );

      expect(feeBumpTx.toXDR()).to.equal(feeBumpV0Tx.toXDR());

      done();
    });
  });

  describe('.fromXDR', function() {
    it('builds a fee bump transaction', function() {
      const xdr =
        'AAAABQAAAADgSJG2GOUMy/H9lHyjYZOwyuyytH8y0wWaoc596L+bEgAAAAAAAADIAAAAAgAAAABzdv3ojkzWHMD7KUoXhrPx0GH18vHKV0ZfqpMiEblG1gAAAGQAAAAAAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA9IYXBweSBiaXJ0aGRheSEAAAAAAQAAAAAAAAABAAAAAOBIkbYY5QzL8f2UfKNhk7DK7LK0fzLTBZqhzn3ov5sSAAAAAAAAAASoF8gAAAAAAAAAAAERuUbWAAAAQK933Dnt1pxXlsf1B5CYn81PLxeYsx+MiV9EGbMdUfEcdDWUySyIkdzJefjpR5ejdXVp/KXosGmNUQ+DrIBlzg0AAAAAAAAAAei/mxIAAABAijIIQpL6KlFefiL4FP8UWQktWEz4wFgGNSaXe7mZdVMuiREntehi1b7MRqZ1h+W+Y0y+Z2HtMunsilT2yS5mAA==';
      let tx = StellarBase.TransactionBuilder.fromXDR(
        xdr,
        StellarBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(StellarBase.FeeBumpTransaction);
      expect(tx.toXDR()).to.equal(xdr);

      tx = StellarBase.TransactionBuilder.fromXDR(
        tx.toEnvelope(), // xdr object
        StellarBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(StellarBase.FeeBumpTransaction);
      expect(tx.toXDR()).to.equal(xdr);
    });
    it('builds a transaction', function() {
      const xdr =
        'AAAAAAW8Dk9idFR5Le+xi0/h/tU47bgC1YWjtPH1vIVO3BklAAAAZACoKlYAAAABAAAAAAAAAAEAAAALdmlhIGtleWJhc2UAAAAAAQAAAAAAAAAIAAAAAN7aGcXNPO36J1I8MR8S4QFhO79T5JGG2ZeS5Ka1m4mJAAAAAAAAAAFO3BklAAAAQP0ccCoeHdm3S7bOhMjXRMn3EbmETJ9glxpKUZjPSPIxpqZ7EkyTgl3FruieqpZd9LYOzdJrNik1GNBLhgTh/AU=';
      let tx = StellarBase.TransactionBuilder.fromXDR(
        xdr,
        StellarBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(StellarBase.Transaction);
      expect(tx.toXDR()).to.equal(xdr);

      tx = StellarBase.TransactionBuilder.fromXDR(
        tx.toEnvelope(), // xdr object
        StellarBase.Networks.TESTNET
      );
      expect(tx).to.be.an.instanceof(StellarBase.Transaction);
      expect(tx.toXDR()).to.equal(xdr);
    });
  });
});
