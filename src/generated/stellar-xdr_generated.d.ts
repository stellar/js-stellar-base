import { Operation as BaseOperation } from '../operation';

declare namespace xdr {
  export class XDRStruct {
    static fromXDR(xdr: Buffer): XDRStruct;

    toXDR(base?: string): Buffer;
    toXDR(encoding: string): string;
  }

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends XDRStruct {
    static fromXDR(xdr: Buffer): Operation;
  }

  export class AssetType extends XDRStruct {
    static fromXDR(xdr: Buffer): AssetType;
    static assetTypeNative(): AssetType;
    static assetTypeCreditAlphanum4(): AssetType;
    static assetTypeCreditAlphanum12(): AssetType;
    name: string;
  }

  export class Asset extends XDRStruct {
    constructor(xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12', xdrType: AssetAlphaNum4 | AssetAlphaNum12)
    static fromXDR(xdr: Buffer): Asset;
    static assetTypeNative(): Asset;
    alphaNum12(): AssetAlphaNum12;
    alphaNum4(): AssetAlphaNum4;
    switch(): AssetType;
  }

  export abstract class AbstractAssetAlphaNum extends XDRStruct {
    constructor(attributes: {
      assetCode: string,
      issuer: any,
    })
    assetCode(): any;
    issuer(): any;
  }
  export class AssetAlphaNum4 extends AbstractAssetAlphaNum {
  }
  export class AssetAlphaNum12 extends AbstractAssetAlphaNum {
  }

  export class Memo extends XDRStruct {
    static fromXDR(xdr: Buffer): Memo;
  }

  export class TransactionEnvelope extends XDRStruct {
    static fromXDR(xdr: Buffer): TransactionEnvelope;
  }

  export class DecoratedSignature extends XDRStruct {
    static fromXDR(xdr: Buffer): DecoratedSignature;

    constructor(keys: { hint: SignatureHint; signature: Signature });

    hint(): SignatureHint;
    signature(): Buffer;
  }

  export class PublicKeyTypeEd25519 extends XDRStruct {
      constructor(somekindBuffer: Buffer);
  }
  export class AccountId extends XDRStruct {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
  }
  export class PublicKey extends XDRStruct {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
  }

  export type SignatureHint = Buffer;
  export type Signature = Buffer;

  export class TransactionResult extends XDRStruct {
    static fromXDR(xdr: Buffer): TransactionResult;
  }
}

export default xdr
// export as namespace xdr
