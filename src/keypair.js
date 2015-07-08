
import {sign, verify} from "./signing";
import * as base58 from "./base58";
import {default as xdr} from "./generated/stellar-xdr_generated";

let nacl = require("tweetnacl");

export class Keypair {

  static fromSeed(seed) {
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
    let publicKey = base58.decodeBase58Check("accountId", address);
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
    return new xdr.AccountId.keyTypesEd25519(this._publicKey);
  }

  publicKey() {
    return new xdr.PublicKey.keyTypesEd25519(this._publicKey);
  }

  rawPublicKey() {
    return this._publicKey;
  }

  signatureHint() {
    let a = this.accountId().toXDR();

    return a.slice(a.length - 4);
  }

  address() {
    return base58.encodeBase58Check("accountId", this._publicKey);
  }

  seed() {
    return base58.encodeBase58Check("seed", this._secretSeed);
  }

  rawSeed() {
    return this._secretSeed;
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

  signDecorated(data) {
    let signature = this.sign(data);
    let hint      = this.signatureHint();

    return new xdr.DecoratedSignature({hint, signature});
  }
}
