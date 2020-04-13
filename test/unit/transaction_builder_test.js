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

      transaction = new StellarBase.TransactionBuilder(source, { fee: 100 })
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

      transaction = new StellarBase.TransactionBuilder(source, { fee: 100 })
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

      transaction = new StellarBase.TransactionBuilder(source, { fee: 1000 })
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
        fee: 100
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
        fee: 100
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
          fee: 100
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
      let transaction = new StellarBase.TransactionBuilder(source, { fee: 100 })
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
        fee: 100
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
          fee: 100
        })
          .setTimeout(0)
          .build();
      }).to.not.throw();
    });
  });
  describe('.buildFeeBumpTransaction', function() {
    it('builds a fee bump transaction', function(done) {
      let networkPassphrase = 'Standalone Network ; February 2017';
      let innerSource = StellarBase.Keypair.master(networkPassphrase);
      let innerAccount = new StellarBase.Account(innerSource.publicKey(), '7');
      let destination =
        'GDQERENWDDSQZS7R7WKHZI3BSOYMV3FSWR7TFUYFTKQ447PIX6NREOJM';
      let amount = '2000.0000000';

      let innerTX = new StellarBase.TransactionBuilder(innerAccount, {
        fee: 100,
        networkPassphrase,
        timebounds: {
          minTime: 0,
          maxTime: 0
        },
        v1: true
      })
        .addOperation(
          StellarBase.Operation.payment({
            destination,
            asset: StellarBase.Asset.native(),
            amount
          })
        )
        .addMemo(StellarBase.Memo.text('Happy birthday!'))
        .build();

      innerTX.sign(innerSource);

      let feeSource = StellarBase.Keypair.fromSecret(
        'SB7ZMPZB3YMMK5CUWENXVLZWBK4KYX4YU5JBXQNZSK2DP2Q7V3LVTO5V'
      );
      let bumpFee = '25000000';
      let transaction = StellarBase.TransactionBuilder.buildFeeBumpTransaction(
        feeSource,
        bumpFee,
        innerTX.toEnvelope(),
        networkPassphrase
      );
      transaction.sign(feeSource);
      const expectedXDR =
        'AAAABQAAAADgSJG2GOUMy/H9lHyjYZOwyuyytH8y0wWaoc596L+bEgAAAAABfXhAAAAAAgAAAABzdv3ojkzWHMD7KUoXhrPx0GH18vHKV0ZfqpMiEblG1gAAAGQAAAAAAAAACAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAA9IYXBweSBiaXJ0aGRheSEAAAAAAQAAAAAAAAABAAAAAOBIkbYY5QzL8f2UfKNhk7DK7LK0fzLTBZqhzn3ov5sSAAAAAAAAAASoF8gAAAAAAAAAAAERuUbWAAAAQK933Dnt1pxXlsf1B5CYn81PLxeYsx+MiV9EGbMdUfEcdDWUySyIkdzJefjpR5ejdXVp/KXosGmNUQ+DrIBlzg0AAAAAAAAAAei/mxIAAABAtRbc7GZeE8cJyZ+R7XGTZKy8s1lTp0rViCHhUa7pDzkaWUI0WUQ5mjsc8+/YhJUXAlPVTbeEbiM6knnPBUFwDw==';

      expect(transaction.isFeeBump()).to.equal(true);
      expect(
        transaction
          .toEnvelope()
          .toXDR()
          .toString('base64')
      ).to.be.equal(expectedXDR);

      expect(transaction.source).to.be.equal(innerAccount.accountId());
      expect(transaction.feeSource).to.be.equal(feeSource.publicKey());

      // shows new fee
      expect(transaction.fee).to.be.equal(bumpFee);

      // can read inner fee
      expect(transaction.innerFee).to.be.equal('100');

      // show innerTx operations and memo
      let operation = transaction.operations[0];
      expect(transaction.memo.type).to.be.equal(StellarBase.MemoText);
      expect(transaction.memo.value.toString('ascii')).to.be.equal(
        'Happy birthday!'
      );
      expect(operation.type).to.be.equal('payment');
      expect(operation.destination).to.be.equal(destination);
      expect(operation.amount).to.be.equal(amount);

      let expectedTxEnvelope = StellarBase.xdr.TransactionEnvelope.fromXDR(
        expectedXDR,
        'base64'
      ).value();

      expect(transaction.source).to.equal(
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

      expect(transaction.innerFee).to.equal(
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

      expect(transaction.innerSignatures.length).to.equal(1);
      expect(
        transaction.innerSignatures[0].toXDR().toString('base64')
      ).to.equal(
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

      done();
    });
  });
});
