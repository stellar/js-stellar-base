import clone from 'lodash/clone';
import padEnd from 'lodash/padEnd';
import trimEnd from 'lodash/trimEnd';
import xdr from './generated/stellar-xdr_generated';
import { Keypair } from './keypair';
import { StrKey } from './strkey';

// TS-TODO: Shall we keep this here or give it its own file?
namespace AssetType {
  export type native = 'native';
  export type credit4 = 'credit_alphanum4';
  export type credit12 = 'credit_alphanum12';
}

export type AssetType =
  | AssetType.native
  | AssetType.credit4
  | AssetType.credit12;


/**
 * Asset class represents an asset, either the native asset (`XLM`)
 * or an asset code / issuer account ID pair.
 *
 * An asset code describes an asset code and issuer pair. In the case of the native
 * asset XLM, the issuer will be null.
 *
 * @constructor
 * @param {string} code - The asset code.
 * @param {string} issuer - The account ID of the issuer.
 */
export class Asset {
  code: string;
  issuer: string | undefined;

  constructor(code: string, issuer?: string) {
    if (!/^[a-zA-Z0-9]{1,12}$/.test(code)) {
      throw new Error(
        'Asset code is invalid (maximum alphanumeric, 12 characters at max)'
      );
    }
    if (String(code).toLowerCase() !== 'xlm' && !issuer) {
      throw new Error('Issuer cannot be null');
    }
    if (issuer && !StrKey.isValidEd25519PublicKey(issuer)) {
      throw new Error('Issuer is invalid');
    }

    this.code = code;
    this.issuer = issuer;
  }

  /**
   * Returns an asset object for the native asset.
   * @Return {Asset}
   */
  static native(): Asset {
    return new Asset('XLM');
  }

  /**
   * Returns an asset object from its XDR object representation.
   * @param {xdr.Asset} assetXdr - The asset xdr object.
   * @returns {Asset}
   */
  static fromOperation(assetXdr: xdr.Asset): Asset {
    let anum;
    let code;
    let issuer;
    switch (assetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
        return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
        anum = assetXdr.alphaNum4();
      /* falls through */
      case xdr.AssetType.assetTypeCreditAlphanum12():
        anum = anum || assetXdr.alphaNum12();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode(), '\0');
        return new this(code, issuer);
      default:
        throw new Error(`Invalid asset type: ${assetXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr object for this asset.
   * @returns {xdr.Asset} XDR Asset object
   */
  public toXDRObject(): xdr.Asset {
    // TS-TODO: perhaps better `if(!this.issuer)`?
    if (this.isNative()) {
      return xdr.Asset.assetTypeNative();
    }
    const issuer = this.issuer!

    let xdrType: typeof xdr.AssetAlphaNum4 | typeof xdr.AssetAlphaNum12;
    let xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12';
    if (this.code.length <= 4) {
      xdrType = xdr.AssetAlphaNum4;
      xdrTypeString = 'assetTypeCreditAlphanum4';
    } else {
      xdrType = xdr.AssetAlphaNum12;
      xdrTypeString = 'assetTypeCreditAlphanum12';
    }

    // pad code with null bytes if necessary
    const padLength = this.code.length <= 4 ? 4 : 12;
    const paddedCode = padEnd(this.code, padLength, '\0');

    // eslint-disable-next-line new-cap
    const assetType = new xdrType({
      assetCode: paddedCode,
      issuer: Keypair.fromPublicKey(issuer).xdrAccountId()
    });

    return new xdr.Asset(xdrTypeString, assetType);
  }

  /**
   * @returns {string} Asset code
   */
  public getCode(): string {
    return clone(this.code);
  }

  /**
   * @returns {string} Asset issuer
   */
  public getIssuer(): string | undefined {
    return clone(this.issuer);
  }

  /**
   * @see [Assets concept](https://www.stellar.org/developers/learn/concepts/assets.html)
   * @returns {string} Asset type. Can be one of following types:
   *
   * * `native`
   * * `credit_alphanum4`
   * * `credit_alphanum12`
   */
  public getAssetType(): AssetType | null {
    if (this.isNative()) {
      return 'native';
    }
    if (this.code.length >= 1 && this.code.length <= 4) {
      return 'credit_alphanum4';
    }
    if (this.code.length >= 5 && this.code.length <= 12) {
      return 'credit_alphanum12';
    }

    return null;
  }

  /**
   * @returns {boolean}  true if this asset object is the native asset.
   */
  public isNative(): boolean {
    return !this.issuer;
  }

  /**
   * @param {Asset} asset Asset to compare
   * @returns {boolean} true if this asset equals the given asset.
   */
  public equals(asset: Asset): boolean {
    return this.code === asset.getCode() && this.issuer === asset.getIssuer();
  }

  public toString(): string {
    if (this.isNative()) {
      return 'native';
    }

    return `${this.getCode()}-${this.getIssuer()}`;
  }
}
