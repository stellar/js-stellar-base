import {Network} from "./network";
import {sign, verify} from "./signing";
import * as base58 from "./base58";
import * as strkey from "./strkey";
import {default as xdr} from "./generated/stellar-xdr_generated";

let nacl = require("tweetnacl");

export class Keypair {
  /**
   * `Keypair` represents public (and secret) keys of the account.
   *
   * Use more convenient methods to create `Keypair` object:
   * * `{@link Keypair.fromAccountId}`
   * * `{@link Keypair.fromSeed}`
   * * `{@link Keypair.random}`
   *
   * @constructor
   * @param {object} keys
   * @param {string} keys.publicKey Raw public key
   * @param {string} [keys.secretSeed] Raw secret key seed.
   */
  constructor(keys) {
    this._publicKey = new Buffer(keys.publicKey);

    if(keys.secretSeed) {
      this._secretSeed = new Buffer(keys.secretSeed);
      this._secretKey = new Buffer(keys.secretKey);
    }
  }

  /**
   * Creates a new `Keypair` instance from secret key seed.
   * @param {string} seed Secret key seed
   * @returns {Keypair}
   */
  static fromSeed(seed) {
    let rawSeed = strkey.decodeCheck("seed", seed);
    return this.fromRawSeed(rawSeed);
  }

  /**
   * Base58 address encoding is **DEPRECATED**! Use this method only for transition to strkey encoding.
   * @param {string} seed Base58 secret seed
   * @deprecated Use {@link Keypair.fromSeed}
   * @returns {Keypair}
   */
  static fromBase58Seed(seed) {
    let rawSeed = base58.decodeBase58Check("seed", seed);
    return this.fromRawSeed(rawSeed);
  }

  /**
   * Creates a new `Keypair` object from secret seed raw bytes.
   *
   * @param {Buffer} rawSeed Buffer containing secret seed
   * @returns {Keypair}
   */
  static fromRawSeed(rawSeed) {
    rawSeed = new Buffer(rawSeed);
    let rawSeedU8 = new Uint8Array(rawSeed);
    let keys = nacl.sign.keyPair.fromSeed(rawSeedU8);
    keys.secretSeed = rawSeed;

    return new this(keys);
  }

  /**
   * Returns `Keypair` object representing network master key.
   * @returns {Keypair}
   */
  static master() {
    return this.fromRawSeed(Network.current().networkId());
  }

  /**
   * Creates a new `Keypair` object from account ID.
   * @param {string} accountId account ID (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
   * @returns {Keypair}
   */
  static fromAccountId(accountId) {
    let publicKey = strkey.decodeCheck("accountId", accountId);
    if (publicKey.length !== 32) {
      throw new Error('Invalid Stellar accountId');
    }
    return new this({publicKey});
  }

  /**
   * Create a random `Keypair` object.
   * @returns {Keypair}
   */
  static random() {
    let seed = nacl.randomBytes(32);
    return this.fromRawSeed(seed);
  }

  /**
   * Returns true if the given Stellar public key is valid.
   * @param {string} publicKey public key to check
   * @returns {boolean}
   */
  static isValidPublicKey(publicKey) {
    try {
      let decoded = strkey.decodeCheck("accountId", publicKey);
      if (decoded.length !== 32) {
        return false;
      }
    } catch (err) {
      return false;
    }
    return true;
  }

  xdrAccountId() {
    return new xdr.AccountId.keyTypeEd25519(this._publicKey);
  }

  xdrPublicKey() {
    return new xdr.PublicKey.keyTypeEd25519(this._publicKey);
  }

  /**
   * Returns raw public key
   * @returns {Buffer}
   */
  rawPublicKey() {
    return this._publicKey;
  }

  signatureHint() {
    let a = this.xdrAccountId().toXDR();

    return a.slice(a.length - 4);
  }

  /**
   * Returns account ID associated with this `Keypair` object.
   * @returns {string}
   */
  accountId() {
    return strkey.encodeCheck("accountId", this._publicKey);
  }

  /**
   * Returns seed associated with this `Keypair` object
   * @returns {string}
   */
  seed() {
    return strkey.encodeCheck("seed", this._secretSeed);
  }

  /**
   * Returns raw secret key seed.
   * @returns {Buffer}
   */
  rawSeed() {
    return this._secretSeed;
  }

  /**
   * Returns raw secret key.
   * @returns {Buffer}
   */
  rawSecretKey() {
    return this._secretKey;
  }

  /**
   * Returns `true` if this `Keypair` object contains secret key and can sign.
   * @returns {boolean}
   */
  canSign() {
    return !!this._secretKey;
  }

  /**
   * Signs data.
   * @param {Buffer} data Data to sign
   * @returns {Buffer}
   */
  sign(data) {
    if (!this.canSign()) {
      throw new Error("cannot sign: no secret key available");
    }

    return sign(data, this._secretKey);
  }

  /**
   * Verifies if `signature` for `data` is valid.
   * @param {Buffer} data Signed data
   * @param {Buffer} signature Signature
   * @returns {boolean}
   */
  verify(data, signature) {
    return verify(data, signature, this._publicKey);
  }

  signDecorated(data) {
    let signature = this.sign(data);
    let hint      = this.signatureHint();

    return new xdr.DecoratedSignature({hint, signature});
  }
}
