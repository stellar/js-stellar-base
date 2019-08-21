import nacl from 'tweetnacl';
import { Network } from './network';
import { sign, verify, generate } from './signing';
import * as base58 from './base58';
import { StrKey } from './strkey';
import { xdr } from './xdr_definitions';

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
  /**
   * Only 'ed25519' is implemented so far.
   */
  public readonly type: string
  protected readonly _publicKey: Buffer
  protected readonly _secretKey?: Buffer
  protected readonly _secretSeed?: Buffer

  constructor(keys: Keypair.IKeys) {
    if (keys.type !== 'ed25519') {
      throw new Error('Invalid keys type');
    }

    this.type = keys.type;

    if (keys.secretKey) {
      keys.secretKey = Buffer.from(keys.secretKey);

      if (keys.secretKey.length !== 32) {
        throw new Error('secretKey length is invalid');
      }

      this._secretSeed = keys.secretKey;
      this._publicKey = generate(keys.secretKey);
      this._secretKey = Buffer.concat([keys.secretKey, this._publicKey]);

      if (
        keys.publicKey &&
        !this._publicKey.equals(Buffer.from(keys.publicKey))
      ) {
        throw new Error('secretKey does not match publicKey');
      }
    } else if(keys.publicKey) {
      this._publicKey = Buffer.from(keys.publicKey);

      if (this._publicKey.length !== 32) {
        throw new Error('publicKey length is invalid');
      }
    } else {
      throw new Error('either secretKey or publicKey must be provided')
    }
  }

  /**
   * Creates a new `Keypair` instance from secret. This can either be secret key or secret seed depending
   * on underlying public-key signature system. Currently `Keypair` only supports ed25519.
   * @param {string} secret secret key (ex. `SDAKFNYEIAORZKKCYRILFQKLLOCNPL5SWJ3YY5NM3ZH6GJSZGXHZEPQS`)
   * @returns {Keypair}
   */
  public static fromSecret(secret: string): Keypair {
    const rawSecret = StrKey.decodeEd25519SecretSeed(secret);
    return this.fromRawEd25519Seed(rawSecret);
  }

  /**
   * Base58 address encoding is **DEPRECATED**! Use this method only for transition to strkey encoding.
   * @param {string} seed Base58 secret seed
   * @deprecated Use {@link Keypair.fromSecret}
   * @returns {Keypair}
   */
  public static fromBase58Seed(seed: string): Keypair {
    const rawSeed = base58.decodeBase58Check('seed', seed);
    return this.fromRawEd25519Seed(rawSeed);
  }

  /**
   * Creates a new `Keypair` object from ed25519 secret key seed raw bytes.
   *
   * @param {Buffer} rawSeed Raw 32-byte ed25519 secret key seed
   * @returns {Keypair}
   */
  public static fromRawEd25519Seed(rawSeed: Buffer): Keypair {
    return new this({ type: 'ed25519', secretKey: rawSeed });
  }

  /**
   * Returns `Keypair` object representing network master key.
   * @returns {Keypair}
   */
  public static master(): Keypair {
    const currentNetwork = Network.current()
    if (currentNetwork === null) {
      throw new Error(
        'No network selected. Use `Network.use`, `Network.usePublicNetwork` or `Network.useTestNetwork` helper methods to select network.'
      );
    }
    return this.fromRawEd25519Seed(currentNetwork.networkId());
  }

  /**
   * Creates a new `Keypair` object from public key.
   * @param {string} publicKey public key (ex. `GB3KJPLFUYN5VL6R3GU3EGCGVCKFDSD7BEDX42HWG5BWFKB3KQGJJRMA`)
   * @returns {Keypair}
   */
  public static fromPublicKey(publicKey: string): Keypair {
    const rawPublicKey = StrKey.decodeEd25519PublicKey(publicKey);
    if (rawPublicKey.length !== 32) {
      throw new Error('Invalid Stellar public key');
    }
    return new this({ type: 'ed25519', publicKey: rawPublicKey });
  }

  /**
   * Create a random `Keypair` object.
   * @returns {Keypair}
   */
  public static random(): Keypair {
    const secret = nacl.randomBytes(32) as Buffer;  // TODO: Investigate `Uint8Array` vs `Buffer`.
    return this.fromRawEd25519Seed(secret);
  }

  public xdrAccountId() {
    return new xdr.AccountId.publicKeyTypeEd25519(this._publicKey);
  }

  public xdrPublicKey() {
    return new xdr.PublicKey.publicKeyTypeEd25519(this._publicKey);
  }

  /**
   * Returns raw public key
   * @returns {Buffer}
   */
  public rawPublicKey(): Buffer {
    return this._publicKey;
  }

  public signatureHint() {
    const a = this.xdrAccountId().toXDR();

    return a.slice(a.length - 4);
  }

  /**
   * Returns public key associated with this `Keypair` object.
   * @returns {string}
   */
  public publicKey(): string {
    return StrKey.encodeEd25519PublicKey(this._publicKey);
  }

  /**
   * Returns secret key associated with this `Keypair` object
   * @returns {string}
   */
  public secret(): string {
    if (!this._secretSeed) {
      throw new Error('no secret key available');
    }

    if (this.type === 'ed25519') {
      return StrKey.encodeEd25519SecretSeed(this._secretSeed);
    }

    throw new Error('Invalid Keypair type');
  }

  /**
   * Returns raw secret key.
   * @returns {Buffer}
   */
  public rawSecretKey(): Buffer | undefined {
    return this._secretSeed;
  }

  /**
   * Returns `true` if this `Keypair` object contains secret key and can sign.
   * @returns {boolean}
   */
  public canSign(): boolean {
    return !!this._secretKey;
  }

  /**
   * Signs data.
   * @param {Buffer} data Data to sign
   * @returns {Buffer}
   */
  public sign(data: Buffer): Buffer {
    if (!this.canSign()) {
      throw new Error('cannot sign: no secret key available');
    }

    // TODO: Condition above doesn't tell that `this._secretKey` is defined in a type-safe manner.
    // Need to investigate alternatives, for now just manually override.
    return sign(data, this._secretKey!);
  }

  /**
   * Verifies if `signature` for `data` is valid.
   * @param {Buffer} data Signed data
   * @param {Buffer} signature Signature
   * @returns {boolean}
   */
  public verify(data: Buffer, signature: Buffer): boolean {
    return verify(data, signature, this._publicKey);
  }

  public signDecorated(data: Buffer) {
    const signature = this.sign(data);
    const hint = this.signatureHint();

    return new xdr.DecoratedSignature({ hint, signature });
  }
}

export namespace Keypair {

  export interface IKeys {
    type: string
    publicKey?: Buffer
    secretKey?: Buffer
  }

}