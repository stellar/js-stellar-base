
import {sign, verify} from "./signing";
import * as base58 from "./base58";
import * as strkey from "./strkey";
import {default as xdr} from "./generated/stellar-xdr_generated";

let nacl = require("tweetnacl");

export class Keypair {

  static fromSeed(seed) {
    let rawSeed = strkey.decodeCheck("seed", seed);
    return this.fromRawSeed(rawSeed);
  }

  /**
   * Base58 address encoding is **DEPRECATED**! Use this method only for transition to base32.
   * @param seed Base58 secret seed
   * @returns StrKey KeyPair object
   */
  static fromBase58Seed(seed) {
    let rawSeed = base58.decodeBase58Check("seed", seed);
    return this.fromRawSeed(rawSeed);
  }

  static fromRawSeed(rawSeed) {
    rawSeed = new Buffer(rawSeed);
    let rawSeedU8 = new Uint8Array(rawSeed);
    let keys = nacl.sign.keyPair.fromSeed(rawSeedU8);
    keys.secretSeed = rawSeed;

    return new this(keys);
  }

  static master() {
    return this.fromRawSeed("allmylifemyhearthasbeensearching");
  }

  static fromAddress(address) {
    let publicKey = strkey.decodeCheck("accountId", address);
    if (publicKey.length !== 32) {
      throw new Error('Invalid Stellar address');
    }
    return new this({publicKey});
  }

  static random() {
    let seed = nacl.randomBytes(32);
    return this.fromRawSeed(seed);
  }

  constructor(keysAndSeed) {
    this._publicKey = new Buffer(keysAndSeed.publicKey);

    if(keysAndSeed.secretSeed) {
      this._secretSeed = new Buffer(keysAndSeed.secretSeed);
      this._secretKey = new Buffer(keysAndSeed.secretKey);
    }
  }

  accountId() {
    return new xdr.AccountId.keyTypeEd25519(this._publicKey);
  }

  publicKey() {
    return new xdr.PublicKey.keyTypeEd25519(this._publicKey);
  }

  rawPublicKey() {
    return this._publicKey;
  }

  signatureHint() {
    let a = this.accountId().toXDR();

    return a.slice(a.length - 4);
  }

  address() {
    return strkey.encodeCheck("accountId", this._publicKey);
  }

  seed() {
    return strkey.encodeCheck("seed", this._secretSeed);
  }

  rawSeed() {
    return this._secretSeed;
  }

  rawSecretKey() {
    return this._secretKey;
  }

  canSign() {
    return !!this._secretKey;
  }

  sign(data) {
    if (!this.canSign()) {
      throw new Error("cannot sign: no secret key available");
    }

    return sign(data, this._secretKey);
  }

  verify(data, signature) {
    return verify(data, signature, this._publicKey);
  }


  signDecorated(data) {
    let signature = this.sign(data);
    let hint      = this.signatureHint();

    return new xdr.DecoratedSignature({hint, signature});
  }
}
