import { hash } from './hashing';

/**
 * Contains passphrases for common networks:
 * * `Networks.PUBLIC`: `Public Global Stellar Network ; September 2015`
 * * `Networks.TESTNET`: `Test SDF Network ; September 2015`
 * @type {{PUBLIC: string, TESTNET: string}}
 */
export const Networks = {
  PUBLIC: 'Public Global Stellar Network ; September 2015',
  TESTNET: 'Test SDF Network ; September 2015'
};

let current = null;

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
 * @deprecated
 */
export class Network {
  constructor(networkPassphrase) {
    this._networkPassphrase = networkPassphrase;
  }

  /**
   * Use Stellar Public Network
   * @returns {void}
   */
  static usePublicNetwork() {
    this.use(new Network(Networks.PUBLIC));
  }

  /**
   * Use test network.
   * @returns {void}
   */
  static useTestNetwork() {
    this.use(new Network(Networks.TESTNET));
  }

  /**
   * Use network defined by Network object.
   * @param {Network} network Network to use
   * @returns {void}
   */
  static use(network) {
    console.trace(
      'Global class `Network` is deprecated. Please pass explicit argument instead, e.g. `new Transaction(envelope, Networks.PUBLIC)` (see https://git.io/fj9fG for more info).'
    );

    current = network;
  }

  /**
   * @returns {Network} Currently selected network
   */
  static current() {
    return current;
  }

  /**
   * @returns {string} Network passphrase
   */
  networkPassphrase() {
    return this._networkPassphrase;
  }

  /**
   * @returns {string} Network ID (SHA-256 hash of network passphrase)
   */
  networkId() {
    return hash(this.networkPassphrase());
  }
}
