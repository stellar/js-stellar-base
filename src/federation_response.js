import {default as xdr} from "./generated/stellar-xdr_generated";
import clone from "lodash/clone";
import isString from 'lodash/isString';
import {hash} from "./hashing";
import {StrKey} from "./strkey";
import {Memo} from "./memo";

/**
 * `FederationResponse` represents response from a federation server.
 *
 * @param {string} stellarAddress address in the form of `user*domain`
 * @param {string} accountId ID of the account (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
 * @param {Memo} memo memo to be used for the stellar address
 * @see [Federation concept](https://www.stellar.org/developers/guides/concepts/federation.html)
 * @class FederationResponse
 */
export class FederationResponse {
  constructor(stellarAddress, accountId, memo) {
    if (!StrKey.isValidEd25519PublicKey(accountId)) {
      throw new Error('accountId is invalid');
    }
    if (memo === undefined) {
      memo = Memo.none();
    }
    else {
      let memo2 = new Memo(memo.type, memo.value);
    }
    FederationResponse._validateStellarAddressValue(stellarAddress);
    this._stellarAddress = stellarAddress;
    this._accountId = accountId;
    this._memo = memo;
  }

  /**
   * Contains the stellar address in the form `user*domain`
   */
  get stellarAddress() {
    return clone(this._stellarAddress);
  }

  set stellarAddress(stellarAddress) {
    throw new Error("FederationResponse is immutable");
  }

  /**
   * Contains the account ID (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
   */
  get accountId() {
    return clone(this._accountId);
  }

  set accountId(accountId) {
    throw new Error("FederationResponse is immutable");
  }

  /**
   * Contains the memo to be used for this stellar address
   */
  get memo() {
    return clone(this._memo);
  }

  set memo(memo) {
    throw new Error("FederationResponse is immutable");
  }
  
  static _validateStellarAddressValue(value) {
    let error = new Error("Expects a stellar address like user*domain. Got " + value);
  
    if (!isString(value)) {
      throw error;
    }

    if (Buffer.byteLength(value, "utf8") > 64) {
      throw new Error("Stellar Address should be <= 64 bytes. Got " + Buffer.byteLength(value, "utf8"));
    }

    let parts = value.split("*");
    if (parts.length != 2) {
      throw error;
    }

    if (Buffer.byteLength(parts[1], "utf8") > 32) {
      throw new Error("`domain` part of address should be <= 32 bytes. Got " + Buffer.byteLength(parts[1], "utf8"));
    }
  }

  /**
   * Returns XDR federation response object.
   * @returns {xdr.FederationResponse}
   */
  toXDRObject() {
    let rawKey = StrKey.decodeEd25519PublicKey(this._accountId);
    return new xdr.FederationResponse({
      stellarAddress: this._stellarAddress,
      accountId: xdr.AccountId.publicKeyTypeEd25519(rawKey),
      memo: this._memo.toXDRObject(),
      ext: new xdr.FederationResponseExt(0)
    });
  }

  /**
   * Returns {@link FederationResponse} from XDR federation response object.
   * @param {xdr.FederationResponse}
   * @returns {FederationResponse}
   */
  static fromXDRObject(object) {
    let memo = Memo.fromXDRObject(object.memo());
    let rawKey = object.accountId().ed25519();
    return new FederationResponse(
      object.stellarAddress(),
      StrKey.encodeEd25519PublicKey(rawKey),
      memo
    );
  }

  /**
   * Returns a hash for this federation response, suitable for signing.
   * @returns {Buffer}
   */
  hash() {
    return hash(this.toXDRObject().toXDR());
  }

  /**
   * Signs the federation response with the given {@link Keypair}.
   * @param {Keypair} keypair Keypair of signer
   * @returns {Buffer}
   */
  sign(keypair) {
    let txHash = this.hash();
    return keypair.sign(txHash);
  }

  /**
   * Verifies the federation response with the given {@link Keypair}.
   * @param {Keypair} keypair Keypair (public key is enough) to verify
   * @param {Buffer} signature signature to compare with
   * @returns {boolean}
   */
  verify(keypair, signature) {
    return keypair.verify(this.hash(), signature);
  }
}
