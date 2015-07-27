let assert = require('assert');
let Promise = require('bluebird');
let axios = require('axios');
let _ = require('lodash');

describe('Functional test', function() {
  this.timeout(20e3);
  let baseUrl = 'https://horizon-testnet.stellar.org';
  let accounts = {};
  let keyPairs = {};
  //let url = 'http://localhost:8000';
  keyPairs['gateway'] = StellarBase.Keypair.fromRawSeed("gateway0000000000000000000000000");
  keyPairs['issuer'] = StellarBase.Keypair.fromRawSeed("issuer00000000000000000000000000");
  keyPairs['alice'] = StellarBase.Keypair.fromRawSeed("alice000000000000000000000000000");
  keyPairs['bob'] = StellarBase.Keypair.fromRawSeed("bob00000000000000000000000000000");

  function fetchAccount(address) {
    return axios.get(baseUrl + '/accounts/' + address)
      .then(function(response) {
        console.log("fetchAccount\n", response.data.balances)
        return response.data;
      })
  }

  function getOffers(address){
    return axios.get(baseUrl + '/accounts/' + address + '/offers')
      .then(function(response) {
        console.log("getOffers\n", response.data)
        return response.data;
      })
  }

  function getAccountTransactions(address){
    return axios.get(baseUrl + '/accounts/' + address + '/transactions')
      .then(function(response) {
        console.log("getAccountTransactions", response.data)
        return response.data;
      })
  }

  function getTransactions(hash){
    return axios.get(baseUrl + '/transactions/' + hash)
      .then(function(response) {
        console.log("getTransactions", response.data)
        return response.data;
      })
  }

  function fetchAccountsSequence() {

    return Promise.each(_.map(keyPairs, function(value, key) {
        return {
          name: key,
          keyPair: value
        }
      }), function(item) {
        var name = item['name'];
        var keyPair = item['keyPair'];
        var address = keyPair.address()
        console.log("address %s %s", name, address)
        return fetchAccount(address)
          .then(function(account) {
            accounts[name] = new StellarBase.Account(address, account.sequence);
          })
          .catch(function(err) {
            console.log("account does not exist")
            return axios.get(baseUrl + '/friendbot?addr=' + address)
              .then(function(response) {
                console.log("friendbot ", response.data)
                  //return response.data;
              })
          })
      })
      .then(function() {
        _.each(accounts, function(account, key) {
          //console.log("accounts %s %s", JSON.stringify(account, null, 4), key);
        });
      })
  }

  function sendTransaction(accountSource, keyPair, operation){
    let input = new StellarBase.TransactionBuilder(accountSource)
      .addOperation(operation)
      .addSigner(keyPair)
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        console.log('sendTransaction\n', response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
        assert(response.data.hash);
      })
  }

  function sendPayment(accountSource, keyPair, option) {
    console.log('sendPayment\n', option);
    return sendTransaction(accountSource, keyPair, StellarBase.Operation.payment(option));
  }

  function manageOffer(accountSource, keyPair, option) {
    console.log('manageOffer\n', option);
    return sendTransaction(accountSource, keyPair, StellarBase.Operation.manageOffer(option));
  }

  function setTrust(accountSource, keyPair, options) {
    console.log("setTrust ", options)
    let opTrust = StellarBase.Operation.changeTrust(options);
    return sendTransaction(accountSource, keyPair, opTrust);
  }

  before(function(done) {
    this.timeout(20e3);
    fetchAccountsSequence().then(done, done)
  })

  it("show addresses", function(done) {
    _.each(keyPairs, function(value, key) {
      //console.log("address %s %s", value.address(), key);
    });
    done()
  });

  it("show offers", function(done) {
    return Promise.each(_.map(keyPairs, function(value, key) {
        return {
          name: key,
          keyPair: value
        }
      }), function(item) {
        var name = item['name'];
        var keyPair = item['keyPair'];
        var address = keyPair.address()
        console.log("show offer %s %s", name, address)
        return getOffers(address)
          .then(function(offers) {
            console.log("address %s %s", name, JSON.stringify(offers, null, 4));
          })
      })
      .then(function(){})
      .then(done, done);
  });

  it("show transactions", function(done) {
    return Promise.each(_.map(keyPairs, function(value, key) {
        return {
          name: key,
          keyPair: value
        }
      }), function(item) {
        var name = item['name'];
        var keyPair = item['keyPair'];
        var address = keyPair.address()
        console.log("show transactions %s %s", name, address)
        return getAccountTransactions(address)
          .then(function(transactions) {
            console.log("address %s %s", name, JSON.stringify(transactions, null, 4));
          })
      })
      .then(function(){})
      .then(done, done);
  });


  it.skip("create account", function(done) {
    var destination = accounts['bob'].address;
    var startingBalance = 1000;
    let createAccountOp = StellarBase.Operation.createAccount({
      destination: destination,
      startingBalance: startingBalance
    });

    let input = new StellarBase.TransactionBuilder(keyPairs['alice'])
      .addOperation(createAccountOp)
      .addSigner(keyPairs['alice'])
      .build()
      .toEnvelope()
      .toXDR('hex');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        console.log(response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
      })
      .then(done, done);
  });

  it("set trust for bonds", function(done) {
    let option = {
      currency: new StellarBase.Currency("SBO", accounts['gateway'].address),
      limit: "1000000"
    }

    var names = ['issuer', 'alice', 'bob'];
    Promise.each(names, function(name) {
        return setTrust(accounts[name], keyPairs[name], option)
      })
      .then(function() {})
      .then(done, done);
  });

  it("set trust for GBP", function(done) {
    let option = {
      currency: new StellarBase.Currency("GBP", accounts['gateway'].address),
      limit: "1000000"
    }

    var names = ['issuer', 'alice', 'bob'];
    Promise.each(names, function(name) {
        return setTrust(accounts[name], keyPairs[name], option)
      })
      .then(function() {})
      .then(done, done);
  });


  it("gateway issue 1000 GBP to alice and bob", function(done) {

    var names = ['alice', 'bob'];
    Promise.each(names, function(name) {
        let option = {
          destination: keyPairs[name].address(),
          currency: new StellarBase.Currency("GBP", accounts['gateway'].address),
          amount: 1000
        }
        return sendPayment(accounts['gateway'], keyPairs['gateway'], option)
      })
      .then(function() {})
      .then(done, done);
  });

  it("alice sends 1 GBP to bob", function(done) {
    let option = {
      destination: keyPairs['bob'].address(),
      currency: new StellarBase.Currency("GBP", accounts['gateway'].address),
      amount: 1
    }
    sendPayment(accounts['alice'], keyPairs['alice'], option).then(done, done);
  });

  it("gateway issue 100 bonds to the issuer", function(done) {
    let option = {
      destination: keyPairs['issuer'].address(),
      currency: new StellarBase.Currency("SBO", accounts['gateway'].address),
      amount: 100
    }
    sendPayment(accounts['gateway'], keyPairs['gateway'], option)
      .then(done, done)
  });

  it("bond issuer creates a sell order of 1 bond for 1000 GBP", function(done) {

    var options = {
      takerGets:new StellarBase.Currency("SBO", accounts['gateway'].address),
      takerPays:new StellarBase.Currency("GBP", accounts['gateway'].address),
      amount:1,
      price:1,
      offerId:1
    };

    manageOffer(accounts['issuer'], keyPairs['issuer'], options)
      .then(done, done)
  });

  it("alice creates a buy order of 1 bond for 1000 GBP", function(done) {

    var options = {
      takerGets:new StellarBase.Currency("GBP", accounts['gateway'].address),
      takerPays:new StellarBase.Currency("SBO", accounts['gateway'].address),
      amount:1,
      price:1,
      offerId:2
    };

    manageOffer(accounts['alice'], keyPairs['alice'], options)
      .then(done, done)
  });

  it("alice sends native currency to bob", function(done) {
    let option = {
      destination: keyPairs['bob'].address(),
      currency: StellarBase.Currency.native(),
      amount: 5 * 10e6
    }
    sendPayment(accounts['alice'], keyPairs['alice'], option)
      .then(done, done)
  });


  it("alice sends an invalid transaction", function(done) {
    let input = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .catch(function(error) {
        //console.log(response.data);
        assert(error);
        //assert.equal(response.data.result, 'received');
      })
      .then(done, done)

  });
});
