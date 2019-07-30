import { hash } from './hashing';

interface Networks {
  PUBLIC: string;
  TESTNET: string;
}

/**
 * Contains passphrases for common networks:
 * * `Networks.PUBLIC`: `Public Global Stellar Network ; September 2015`
 * * `Networks.TESTNET`: `Test SDF Network ; September 2015`
 * @type {{PUBLIC: string, TESTNET: string}}
 */
export const Networks: Networks = {
  PUBLIC: 'Public Global Stellar Network ; September 2015',
  TESTNET: 'Test SDF Network ; September 2015'
};

let current: Network | null = null;

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
export class Network {
  private _networkPassphrase: string;

  constructor(networkPassphrase: string) {
    this._networkPassphrase = networkPassphrase;
  }

  /**
   * Use Stellar Public Network
   * @returns {void}
   */
  static usePublicNetwork(): void {
    this.use(new Network(Networks.PUBLIC));
  }

  /**
   * Use test network.
   * @returns {void}
   */
  static useTestNetwork(): void {
    this.use(new Network(Networks.TESTNET));
  }

  /**
   * Use network defined by Network object.
   * @param {Network} network Network to use
   * @returns {void}
   */
  static use(network: Network): void {
    current = network;
  }

  /**
   * @returns {Network} Currently selected network
   */
  static current(): Network | null {
    return current;
  }

  /**
   * @returns {string} Network passphrase
   */
  public networkPassphrase(): string {
    return this._networkPassphrase;
  }

  /**
   * @returns {string} Network ID (SHA-256 hash of network passphrase)
   */
  public networkId(): Buffer {
    return hash(this.networkPassphrase());
  }
}
