import {Network} from "./network";
import {sign, verify} from "./signing";
import * as base58 from "./base58";
import {StrKey} from "./strkey";
import {default as xdr} from "./generated/stellar-xdr_generated";
import nacl from "tweetnacl";

/**
 * `Keypair` represents public (and secret) keys of the account.
 *
 * Currently `Keypair` only supports ed25519 but in a future this class can be abstraction layer for other
 * public-key signature systems.
 *
 * Use more convenient methods to create `Keypair` object:
 * * `{@link Keypair.fromPublicKey}`
 * * `{@link Keypair.fromSecret}`
 * * `{@link Keypair.random}`
 *
 * @constructor
 * @param {object} keys At least one of keys must be provided.
 * @param {string} keys.type Public-key signature system name. (currently only `ed25519` keys are supported)
 * @param {Buffer} [keys.publicKey] Raw public key
 * @param {Buffer} [keys.secretKey] Raw secret key (32-byte secret seed in ed25519`)
 */
export class Keypair {
  constructor(keys) {
    if (keys.type != "ed25519") {
      throw new Error("Invalid keys type");
    }

    this.type = keys.type;

    if (keys.secretKey) {
      keys.secretKey = new Buffer(keys.secretKey);

      if (keys.secretKey.length != 32) {
        throw new Error("secretKey length is invalid");
      }

      let secretKeyUint8 = new Uint8Array(keys.secretKey);
      let naclKeys = nacl.sign.keyPair.fromSeed(secretKeyUint8);

      this._secretSeed = keys.secretKey;
      this._secretKey = new Buffer(naclKeys.secretKey);
      this._publicKey = new Buffer(naclKeys.publicKey);

      if (keys.publicKey && !this._publicKey.equals(new Buffer(keys.publicKey))) {
        throw new Error("secretKey does not match publicKey");
      }
    } else {
      this._publicKey = new Buffer(keys.publicKey);

      if (this._publicKey.length != 32) {
        throw new Error("publicKey length is invalid");
      }
    }
  }

  /**
   * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
   * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
   * @param {string} secret secret key (ex. `SDAKFNYEIAORZKKCYRILFQKLLOCNPL5SWJ3YY5NM3ZH6GJSZGXHZEPQS`)
   * @returns {Keypair}
   */
  static fromSecret(secret) {
    let rawSecret = StrKey.decodeEd25519SecretSeed(secret);
    return this.fromRawEd25519Seed(rawSecret);
  }

  /**
   * Base58 address encoding is **DEPRECATED**! Use this method only for transition to strkey encoding.
   * @param {string} seed Base58 secret seed
   * @deprecated Use {@link Keypair.fromSecret}
   * @returns {Keypair}
   */
  static fromBase58Seed(seed) {
    let rawSeed = base58.decodeBase58Check("seed", seed);
    return this.fromRawEd25519Seed(rawSeed);
  }

  /**
   * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
   *
   * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
   * @returns {Keypair}
   */
  static fromRawEd25519Seed(rawSeed) {
    return new this({type: 'ed25519', secretKey: rawSeed});
  }

  /**
   * Returns `Keypair` object representing network master key.
   * @returns {Keypair}
   */
  static master() {
    if (Network.current() === null) {
      throw new Error("No network selected. Use `Network.use`, `Network.usePublicNetwork` or `Network.useTestNetwork` helper methods to select network.");
    }
    return this.fromRawEd25519Seed(Network.current().networkId());
  }

  /**
   * Creates a new `Keypair` object from public key.
   * @param {string} publicKey public key (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
   * @returns {Keypair}
   */
  static fromPublicKey(publicKey) {
    publicKey = StrKey.decodeEd25519PublicKey(publicKey);
    if (publicKey.length !== 32) {
      throw new Error('Invalid Stellar public key');
    }
    return new this({type: 'ed25519', publicKey});
  }

  /**
   * Create a random `Keypair` object.
   * @returns {Keypair}
   */
  static random() {
    let secret = nacl.randomBytes(32);
    return this.fromRawEd25519Seed(secret);
  }

  xdrAccountId() {
    return new xdr.AccountId.publicKeyTypeEd25519(this._publicKey);
  }

  xdrPublicKey() {
    return new xdr.PublicKey.publicKeyTypeEd25519(this._publicKey);
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
   * Returns public key associated with this `Keypair` object.
   * @returns {string}
   */
  publicKey() {
    return StrKey.encodeEd25519PublicKey(this._publicKey);
  }

  /**
   * Returns secret key associated with this `Keypair` object
   * @returns {string}
   */
  secret() {
    if (!this._secretSeed) {
      throw new Error("no secret key available");
    }

    if (this.type == 'ed25519') {
      return StrKey.encodeEd25519SecretSeed(this._secretSeed);
    }

    throw new Error("Invalid Keypair type");
  }

  /**
   * Returns raw secret key.
   * @returns {Buffer}
   */
  rawSecretKey() {
    return this._secretSeed;
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
