import { trimEnd } from "./util/util.js";
import xdr from "./xdr.js";
import { Keypair } from "./keypair.js";
import { StrKey } from "./strkey.js";
import { hash } from "./hashing.js";

export type AssetType = "credit_alphanum4" | "credit_alphanum12" | "native";

interface XdrAssetConstructor<T> {
  assetTypeNative(): T;
  new (type: string, value: xdr.AlphaNum4 | xdr.AlphaNum12): T;
}

/**
 * Asset class represents an asset, either the native asset (`XLM`)
 * or an asset code / issuer account ID pair.
 *
 * An asset code describes an asset code and issuer pair. In the case of the native
 * asset XLM, the issuer will be null.
 *
 * @constructor
 * @param code - The asset code.
 * @param issuer - The account ID of the issuer.
 */
export class Asset {
  readonly code: string;
  readonly issuer: string | undefined;

  constructor(code: string, issuer?: string) {
    if (!/^[a-zA-Z0-9]{1,12}$/.test(code)) {
      throw new Error(
        "Asset code is invalid (maximum alphanumeric, 12 characters at max)"
      );
    }
    if (String(code).toLowerCase() !== "xlm" && !issuer) {
      throw new Error("Issuer cannot be null");
    }
    if (issuer && !StrKey.isValidEd25519PublicKey(issuer)) {
      throw new Error("Issuer is invalid");
    }

    if (String(code).toLowerCase() === "xlm") {
      // transform all xLM, Xlm, etc. variants -> XLM
      this.code = "XLM";
    } else {
      this.code = code;
    }

    this.issuer = issuer;
  }

  /**
   * Returns an asset object for the native asset.
   * @returns {Asset}
   */
  static native(): Asset {
    return new Asset("XLM");
  }

  /**
   * Returns an asset object from its XDR object representation.
   * @param assetXdr - The asset xdr object.
   * @returns {Asset}
   */
  static fromOperation(assetXdr: xdr.Asset): Asset {
    let anum;
    let code: string;
    let issuer: string;
    switch (assetXdr.switch()) {
      case xdr.AssetType.assetTypeNative():
        return this.native();
      case xdr.AssetType.assetTypeCreditAlphanum4():
        anum = assetXdr.alphaNum4();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode().toString(), "\0") as string;
        return new this(code, issuer);
      case xdr.AssetType.assetTypeCreditAlphanum12():
        anum = assetXdr.alphaNum12();
        issuer = StrKey.encodeEd25519PublicKey(anum.issuer().ed25519());
        code = trimEnd(anum.assetCode().toString(), "\0") as string;
        return new this(code, issuer);
      default:
        throw new Error(`Invalid asset type: ${assetXdr.switch().name}`);
    }
  }

  /**
   * Returns the xdr.Asset object for this asset.
   * @returns {xdr.Asset} XDR asset object
   */
  toXDRObject(): xdr.Asset {
    return this._toXDRObject(xdr.Asset);
  }

  /**
   * Returns the xdr.ChangeTrustAsset object for this asset.
   * @returns {xdr.ChangeTrustAsset} XDR asset object
   */
  toChangeTrustXDRObject(): xdr.ChangeTrustAsset {
    return this._toXDRObject(xdr.ChangeTrustAsset);
  }

  /**
   * Returns the xdr.TrustLineAsset object for this asset.
   * @returns {xdr.TrustLineAsset} XDR asset object
   */
  toTrustLineXDRObject(): xdr.TrustLineAsset {
    return this._toXDRObject(xdr.TrustLineAsset);
  }

  /**
   * Returns the would-be contract ID (`C...` format) for this asset on a given
   * network.
   *
   * @param networkPassphrase - indicates which network the contract
   *    ID should refer to, since every network will have a unique ID for the
   *    same contract (see {@link Networks} for options)
   *
   * @returns the strkey-encoded (`C...`) contract ID for this asset
   *
   * @warning This makes no guarantee that this contract actually *exists*.
   */
  contractId(networkPassphrase: string): string {
    const networkId = hash(Buffer.from(networkPassphrase));
    const preimage = xdr.HashIdPreimage.envelopeTypeContractId(
      new xdr.HashIdPreimageContractId({
        networkId,
        contractIdPreimage: xdr.ContractIdPreimage.contractIdPreimageFromAsset(
          this.toXDRObject()
        )
      })
    );

    return StrKey.encodeContract(hash(preimage.toXDR()));
  }

  /**
   * Returns the xdr object for this asset.
   * @param xdrAsset - The xdr asset constructor.
   * @returns XDR Asset object
   */
  private _toXDRObject<T>(xdrAsset: XdrAssetConstructor<T>): T {
    if (this.isNative()) {
      return xdrAsset.assetTypeNative();
    }

    // This should never happen because the constructor should throw an error if the issuer is null for a non-native asset, but we check here just to be safe.
    if (!this.issuer) {
      throw new Error("Issuer cannot be null for non-native asset");
    }

    let xdrType;
    let xdrTypeString: string;
    if (this.code.length <= 4) {
      xdrType = xdr.AlphaNum4;
      xdrTypeString = "assetTypeCreditAlphanum4";
    } else {
      xdrType = xdr.AlphaNum12;
      xdrTypeString = "assetTypeCreditAlphanum12";
    }

    // pad code with null bytes if necessary
    const padLength = this.code.length <= 4 ? 4 : 12;
    const paddedCode = this.code.padEnd(padLength, "\0");

    const assetType = new xdrType({
      assetCode: paddedCode,
      issuer: Keypair.fromPublicKey(this.issuer).xdrAccountId()
    });

    return new xdrAsset(xdrTypeString, assetType);
  }

  /**
   * @returns Asset code
   */
  getCode(): string {
    return String(this.code);
  }

  /**
   * @returns Asset issuer
   */
  getIssuer(): string | undefined {
    if (this.issuer === undefined) {
      return undefined;
    }
    return String(this.issuer);
  }

  /**
   * @see [Assets concept](https://developers.stellar.org/docs/glossary/assets/)
   * @returns Asset type. Can be one of following types:
   *
   *  - `native`,
   *  - `credit_alphanum4`,
   *  - `credit_alphanum12`, or
   *  - `unknown` as the error case (which should never occur)
   */
  getAssetType(): AssetType | "unknown" {
    switch (this.getRawAssetType().value) {
      case xdr.AssetType.assetTypeNative().value:
        return "native";
      case xdr.AssetType.assetTypeCreditAlphanum4().value:
        return "credit_alphanum4";
      case xdr.AssetType.assetTypeCreditAlphanum12().value:
        return "credit_alphanum12";
      default:
        return "unknown";
    }
  }

  /**
   * @returns the raw XDR representation of the asset type
   */
  getRawAssetType(): xdr.AssetType {
    if (this.isNative()) {
      return xdr.AssetType.assetTypeNative();
    }

    if (this.code.length <= 4) {
      return xdr.AssetType.assetTypeCreditAlphanum4();
    }

    return xdr.AssetType.assetTypeCreditAlphanum12();
  }

  /**
   * @returns true if this asset object is the native asset.
   */
  isNative(): boolean {
    return !this.issuer;
  }

  /**
   * @param asset - Asset to compare
   * @returns true if this asset equals the given asset.
   */
  equals(asset: Asset): boolean {
    return this.code === asset.getCode() && this.issuer === asset.getIssuer();
  }

  toString(): string {
    if (this.isNative()) {
      return "native";
    }

    return `${this.getCode()}:${this.getIssuer()}`;
  }

  /**
   * Compares two assets according to the criteria:
   *
   *  1. First compare the type (native < alphanum4 < alphanum12).
   *  2. If the types are equal, compare the assets codes.
   *  3. If the asset codes are equal, compare the issuers.
   *
   * @param assetA - the first asset
   * @param assetB - the second asset
   * @returns `-1` if assetA < assetB, `0` if assetA == assetB, `1` if assetA > assetB.
   */
  static compare(assetA: Asset, assetB: Asset): -1 | 0 | 1 {
    if (!assetA || !(assetA instanceof Asset)) {
      throw new Error("assetA is invalid");
    }
    if (!assetB || !(assetB instanceof Asset)) {
      throw new Error("assetB is invalid");
    }

    if (assetA.equals(assetB)) {
      return 0;
    }

    // Compare asset types.
    const xdrAtype = assetA.getRawAssetType().value;
    const xdrBtype = assetB.getRawAssetType().value;
    if (xdrAtype !== xdrBtype) {
      return xdrAtype < xdrBtype ? -1 : 1;
    }

    // Compare asset codes.
    const result = asciiCompare(assetA.getCode(), assetB.getCode());
    if (result !== 0) {
      return result;
    }

    // Compare asset issuers.
    return asciiCompare(assetA.getIssuer()!, assetB.getIssuer()!);
  }
}

/**
 * Compares two ASCII strings in lexographic order with uppercase precedence.
 *
 * @param a - the first string to compare
 * @param b - the second
 * @returns like all `compare()`s:
 *     -1 if `a < b`, 0 if `a == b`, and 1 if `a > b`
 *
 * @warning No type-checks are done on the parameters
 */
function asciiCompare(a: string, b: string): -1 | 0 | 1 {
  return Buffer.compare(Buffer.from(a, "ascii"), Buffer.from(b, "ascii"));
}
