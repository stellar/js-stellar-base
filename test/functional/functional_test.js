var assert = require('assert');
var Promise = require('bluebird');

describe('Functional test', function() {
  this.timeout(10e3);
  let url = 'https://horizon-testnet.stellar.org';
  //let url = 'http://localhost:8000';
  let supertest = require('supertest')(url);

  let gateway = {
    public:"gLf9Js8MYGUKAPJLKoDhUcSg8BcHtrnu2KSZkGMvsnQwhMTTVJ"
  };
  let accountAlice;
  let keysAlice = {
    public:"gsQx3Uofqu2SMHCwzvpeDPjENJF8d9N9GXmnsAQqD6nhMwypbXG",
    seed:"sfjGjkUHxr5wffg4NPkdFK3fJyT9PjXyu1gAMwHiKdgdXsb3sZ1"
  };

  let keysBob = {
    public:'gs3uhS4n248kCAVJrAw2eirZt88pnEXUq2sB9AcD3fDMJAwSKbN'
  };

  function fetchAccount(publicKey, done){
    return new Promise(function(resolve, reject){
      supertest.get('/accounts/' + publicKey)
        .expect(200)
        .end(function(err, result) {
          if(err) return reject(err);

          assert(!err);
          assert(result);
          assert(result.text);
          var account = JSON.parse(result.text);
          assert(account.balances);
          console.log(JSON.stringify(account, null, 4));
          return resolve(account);
        });
    })
  }

  before(function(done){
    fetchAccount(keysAlice.public)
    .then(function(account){
      //console.log("seqAlice ", seqAlice);
      accountAlice = new StellarBase.Account(keysAlice.public, account.sequence);
    })
    .then(done, done)
  })

  it.skip("create account", function(done) {
    var destination = keysBob.public;
    var startingBalance = 1000;
    let createAccountOp = StellarBase.Operation.createAccount({
        destination: destination,
        startingBalance: startingBalance
    });

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
                .addOperation(createAccountOp)
                .addSigner(keyPairAlice)
                .build()
                .toEnvelope()
                .toXDR('hex');

    //console.log(input)
    supertest.post('/transactions')
      .set('Content-Type',  'application/x-www-form-urlencoded')
      .send("tx=" + input)
      .end(function(err, result) {
        //assert(!err)
        //console.log(err);
        console.log(result.body);
        //assert.equal(result.body.foo, 'Bar');
        done();
      });

  });

  it("alice sends native currency to bob", function(done) {
    let destination = keysBob.public
    let currency    = StellarBase.Currency.native();
    let amount      = "5";

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
                .addOperation(StellarBase.Operation.payment({destination, currency, amount}))
                .addSigner(keyPairAlice)
                .build()
                .toEnvelope()
                .toXDR('hex');

    //console.log(input)
    supertest.post('/transactions')
      .set('Content-Type',  'application/x-www-form-urlencoded')
      .send("tx=" + input)
      .end(function(err, result) {
        //assert(!err)
        //console.log(err);
        console.log(result.body);
        var errorXdr = result.body.error;
        var operation = StellarBase.xdr.TransactionResult.fromXDR(new Buffer(errorXdr, "hex"));
        console.log(JSON.stringify(operation, null, 4));
        //assert.equal(result.body.foo, 'Bar');
        done();
      });
  });

  it.skip("set trust", function(done) {
    let trustor = gateway.public;
    let currencyCode = "USD";
    let authorize = true;

    let opTrust = StellarBase.Operation.allowTrust({
        trustor: trustor,
        currencyCode: currencyCode,
        authorize: authorize
    });

    var keyPairAlice = StellarBase.Keypair.fromSeed(keysAlice.seed);

    let input = new StellarBase.TransactionBuilder(accountAlice)
                .addSigner(keyPairAlice)
                .addOperation(opTrust)
                .build()
                .toEnvelope()
                .toXDR('hex');

    supertest.post('/transactions')
      .send("tx=" + input)
      .end(function(err, result) {
        //assert(!err)
        //console.log(err);
        console.log(result.body);
        //assert.equal(result.body.foo, 'Bar');
        done();
      });
  });

  it("alice sends an invalid transaction", function(done) {
        let input = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

        supertest.post('/transactions')
          .send("tx=" + input)
          .end(function(err, result) {
            assert(err)
            assert.equal(err.status, 500);
            //console.log(err);
            assert.equal(result.body.type, 'server_error');
            done();
          });
      });
});
