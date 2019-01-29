'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Network = exports.Networks = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hashing = require('./hashing');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Contains passphrases for common networks:
 * * `Networks.PUBLIC`: `Public Global Stellar Network ; September 2015`
 * * `Networks.TESTNET`: `Test SDF Network ; September 2015`
 * @type {{PUBLIC: string, TESTNET: string}}
 */
var Networks = exports.Networks = {
  PUBLIC: 'Public Global Stellar Network ; September 2015',
  TESTNET: 'Test SDF Network ; September 2015'
};

var _current = null;

/**
 * The Network class provides helper methods to get the passphrase or id for different
 * stellar networks.  It also provides the {@link Network.current} class method that returns the network
 * that will be used by this process for the purposes of generating signatures.
 *
 * You should select network your app will use before adding the first signature. You can use the `use`,
 * `usePublicNetwork` and `useTestNetwork` helper methods.
 *
 * Creates a new `Network` object.
 * @constructor
 * @param {string} networkPassphrase Network passphrase
 */

var Network = exports.Network = function () {
  function Network(networkPassphrase) {
    _classCallCheck(this, Network);

    this._networkPassphrase = networkPassphrase;
  }

  /**
   * Use Stellar Public Network
   * @returns {void}
   */


  _createClass(Network, [{
    key: 'networkPassphrase',


    /**
     * @returns {string} Network passphrase
     */
    value: function networkPassphrase() {
      return this._networkPassphrase;
    }

    /**
     * @returns {string} Network ID (SHA-256 hash of network passphrase)
     */

  }, {
    key: 'networkId',
    value: function networkId() {
      return (0, _hashing.hash)(this.networkPassphrase());
    }
  }], [{
    key: 'usePublicNetwork',
    value: function usePublicNetwork() {
      this.use(new Network(Networks.PUBLIC));
    }

    /**
     * Use test network.
     * @returns {void}
     */

  }, {
    key: 'useTestNetwork',
    value: function useTestNetwork() {
      this.use(new Network(Networks.TESTNET));
    }

    /**
     * Use network defined by Network object.
     * @param {Network} network Network to use
     * @returns {void}
     */

  }, {
    key: 'use',
    value: function use(network) {
      _current = network;
    }

    /**
     * @returns {Network} Currently selected network
     */

  }, {
    key: 'current',
    value: function current() {
      return _current;
    }
  }]);

  return Network;
}();