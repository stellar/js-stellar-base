let assert = require('assert');
let Promise = require('bluebird');
let axios = require('axios');
let _ = require('lodash');

/**

Accounts:

* gateway: the account used for issuing the assets: currency + security.
* security issuer: the account owned by the entity that issue the security.
* alice and bob: investors that intend to buy & sell securities.

Phases:

1. Accounts are created by funding them with the native stellar currency called lumnen.

2. Trust lines are set from the investors/security issuer to the gateway for all assets.

3. Gateway issues securities to the security issuer.

4. Investors sends currency through a traditional bank transfer to the gateway's bank account. The gateway then issues currency to the investors on the ledger.

5. The issuer creates a sell order to exchange securities against currency, i.e selling order of 1000 bonds @ 1000£/bond

6. Alice creates a buy order that matches the previous sell order, i.e buy order of 10 bonds @ 1000£/bond
When the order is matched, Alice now have 10 bonds and the issuer has 990 bonds and 10k£

7. Alice is now free to create a sell order at any price that may be bought by Bob or any other investors.

**/
describe('Functional test:', function() {
  this.timeout(40e3);
  //let baseUrl = 'https://horizon-testnet.stellar.org';
  //let baseUrl = 'http://52.6.108.145:3000';
  //let baseUrl = 'http://localhost:3000'
  let baseUrl = 'http://localhost:8000'
  let accounts = {};
  let keyPairs = {};
  //let url = 'http://localhost:8000';
  let keyPairMaster = StellarBase.Keypair.fromRawSeed("allmylifemyhearthasbeensearching");
  var accountMaster;
  let keyPairFriendBot =  StellarBase.Keypair.fromSeed('SCAAUH3T2ZOBYO56V2QRIG4GX7YLYLG6T3IEMDZY4REURV6JIMPJK2AW');
  keyPairs['gateway'] = StellarBase.Keypair.fromRawSeed("gateway0000000000000000000000000");
  keyPairs['issuer'] = StellarBase.Keypair.fromRawSeed("issuer00000000000000000000000000");
  keyPairs['alice'] = StellarBase.Keypair.fromRawSeed("alice000000000000000000000000000");
  keyPairs['bob'] = StellarBase.Keypair.fromRawSeed("bob00000000000000000000000000000");

  function fetchAccount(address) {
    return axios.get(baseUrl + '/accounts/' + address)
      .then(function(response) {
        console.log("fetchAccount %s has %s\n",
         address, JSON.stringify(response.data.balances, null, 4))
        return response.data;
      })
  }

  function getOffers(address) {
    return axios.get(baseUrl + '/accounts/' + address + '/offers')
      .then(function(response) {
        console.log("getOffers\n", response.data)
        return response.data;
      })
  }

  function cancelOffers(name) {
    console.log("cancelOffers ", name);
    let address = accounts[name].address;
    assert(address);
    return axios.get(baseUrl + '/accounts/' + address + '/offers')
      .then(function(response) {
        console.log("getOffers\n", response.data)
        console.log("#Offers\n", response.data._embedded.records.length);
        var orderIds = _.pluck(response.data._embedded.records, "id");
        return orderIds;
      })
      .then(function(orderIds) {
        console.log(orderIds);
        return Promise.each(orderIds, function(orderId) {
          var options = {
            takerGets: new StellarBase.Asset("SBO", accounts['gateway'].address),
            takerPays: new StellarBase.Asset("GBP", accounts['gateway'].address),
            amount: 0,
            price: 1,
            offerId: orderId
          };

          return manageOffer(accounts['issuer'], keyPairs['issuer'], options)
        })
      })
      .then(function() {})
  }

  function getAccountTransactions(address) {
    return axios.get(baseUrl + '/accounts/' + address + '/transactions')
      .then(function(response) {
        console.log("getAccountTransactions", response.data)
        return response.data;
      })
  }

  function getTransactions() {
    return axios.get(baseUrl + '/transactions')
      .then(function(response) {
        console.log("getTransactions", response.data)
        return response.data;
      })
  }

  function getTransaction(hash) {
    return axios.get(baseUrl + '/transactions/' + hash)
      .then(function(response) {
        console.log("getTransaction", response.data)
        return response.data;
      })
      .catch(function(error) {
        console.log("getTransaction error ", error);
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
            console.log("account error ", err)
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

  function sendTransaction(accountSource, keyPair, operation) {
    let input = new StellarBase.TransactionBuilder(accountSource)
      .addOperation(operation)
      .addSigner(keyPair)
      .build()
      .toEnvelope()
      .toXDR('base64');

    return axios.post(baseUrl + '/transactions', {
        tx: input
      })
      .then(function(response) {
        console.log('sendTransaction\n', response.data);
        assert(response.data);
        assert.equal(response.data.result, 'received');
        assert(response.data.hash);
        return response.data;
      })
      .catch(function(error) {
        console.error('sendTransaction\n', error);
        if (error.data.error) {
          var errorMessage = StellarBase.xdr.TransactionResult.fromXDR(new Buffer(error.data.error, "base64"));
          console.error('sendTransaction message\n', JSON.stringify(errorMessage, null, 4));
        }

        throw error;
      })
/*
      .then(function(data) {
        return Promise.delay(10e3)
        .then(function() {
          return getTransaction(data.hash)
        })
      })
      .then(function(transaction) {
        //assert(transaction.hash)
      })
*/
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

  function initAccount(address) {
    return fetchAccount(address)
      .then(function(accountData) {
        return new StellarBase.Account(address, accountData.sequence);
      })
  }

  function createAccount(accountMaster, fromKeyPair, destination){
    var startingBalance = 1000;
    let createAccountOp = StellarBase.Operation.createAccount({
      destination: destination,
      startingBalance: startingBalance
    });
    return sendTransaction(accountMaster, fromKeyPair, createAccountOp);
  }

  it("show addresses", function(done) {
    console.log("address %s %s", keyPairMaster.address(), 'master');
    console.log("address %s %s", keyPairFriendBot.address(), 'friendbot');

    _.each(keyPairs, function(value, key) {
      console.log("address %s %s", value.address(), key);
    });
    done()
  });

  it("show recent transactions", function(done) {
    getTransactions()
      .then(function(result){
        assert(result)
      })
      .then(done, done)
  });

  describe('provisioning', function() {

    it("get master account", function(done) {
      initAccount(keyPairMaster.address())
        .then(function(account) {
          console.log("Master account ", account);
          accountMaster = account;
        })
        .then(done, done);
    });

    it("create friendbot account", function(done) {
      var destination = keyPairFriendBot.address();
      createAccount(accountMaster, keyPairMaster, destination)
        .then(function(result){
        })
        .then(done, done);
    });
    it("master sends native currency to friendbot", function(done) {
      var destination = keyPairFriendBot.address();

      let option = {
        destination: destination,
        asset: StellarBase.Asset.native(),
        amount: 5 * 10e6
      }
      sendPayment(accountMaster, keyPairMaster, option)
        .then(function() {
          return Promise.delay(6e3)
        })
        .then(function() {
          return fetchAccount(destination);
        })
        .then(function() {
        })
        .then(done, done)
    });

  })

  describe('transactions', function() {

    before(function(done) {
      this.timeout(20e3);
      fetchAccountsSequence().then(done, done)
    })

    after(function(done) {
      this.timeout(20e3);
      fetchAccountsSequence().then(done, done)
    })




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
        .then(function() {})
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
        .then(function() {})
        .then(done, done);
    });


    it.skip("create account", function(done) {

    });

    it("set trust for bonds", function(done) {
      let option = {
        asset: new StellarBase.Asset("SBO", accounts['gateway'].address),
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
        asset: new StellarBase.Asset("GBP", accounts['gateway'].address),
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
            asset: new StellarBase.Asset("GBP", accounts['gateway'].address),
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
        asset: new StellarBase.Asset("GBP", accounts['gateway'].address),
        amount: 1
      }

      sendPayment(accounts['alice'], keyPairs['alice'], option)
        .then(function() {})
        .then(done, done);
    });

    it("gateway issue 100 bonds to the issuer", function(done) {
      let option = {
        destination: keyPairs['issuer'].address(),
        asset: new StellarBase.Asset("SBO", accounts['gateway'].address),
        amount: 100
      }
      sendPayment(accounts['gateway'], keyPairs['gateway'], option)
        .then(function() {})
        .then(done, done)
    });


    describe('trading: ', function() {
      it("bond issuer cancels all orders", function(done) {
        cancelOffers('issuer')
          .then(done, done)
      });

      it("bond issuer creates a sell order of 10 bond for 1000 GBP", function(done) {

        var options = {
          buying: new StellarBase.Asset("SBO", accounts['gateway'].address),
          selling: new StellarBase.Asset("GBP", accounts['gateway'].address),
          amount: 1,
          price: 1,
          offerId: 0
        };

        manageOffer(accounts['issuer'], keyPairs['issuer'], options)
          .then(function() {
            return Promise.delay(5e3)
          })
          .then(done, done)
      });

      it("alice creates a buy order of 1 bond for 1000 GBP", function(done) {

        var options = {
          buying: new StellarBase.Asset("GBP", accounts['gateway'].address),
          selling: new StellarBase.Asset("SBO", accounts['gateway'].address),
          amount: 1,
          price: 1,
          offerId: 0
        };

        manageOffer(accounts['alice'], keyPairs['alice'], options)
          .then(function(result) {
            return Promise.delay(6e3)
              .then(function() {
                return getTransaction(result.hash)
              })
          })
          .then(function() {

          })
          .then(done, done)
      });
    })

    it("alice sends native currency to bob", function(done) {
      let option = {
        destination: keyPairs['bob'].address(),
        asset: StellarBase.Asset.native(),
        amount: 5 * 10e6
      }
      sendPayment(accounts['alice'], keyPairs['alice'], option)
        .then(function() {})
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
  })
});
