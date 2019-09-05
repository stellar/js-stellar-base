import { Operation as BaseOperation } from '../operation';
import { Struct, Opaque, Void } from 'js-xdr';

declare namespace xdr {

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends Struct {
    static fromXDR(xdr: Buffer): Operation;
  }

  export class AssetType extends Struct {
    static fromXDR(xdr: Buffer): AssetType;
    static assetTypeNative(): AssetType;
    static assetTypeCreditAlphanum4(): AssetType;
    static assetTypeCreditAlphanum12(): AssetType;
    name: string;
  }

  export class AssetCode4 extends Opaque {}
  export class AssetCode12 extends Opaque {}

  export class Asset extends Struct {
    constructor(xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12', xdrType: AssetAlphaNum4 | AssetAlphaNum12)
    static fromXDR(xdr: Buffer): Asset;
    static assetTypeNative(): Asset;
    alphaNum12(): AssetAlphaNum12;
    alphaNum4(): AssetAlphaNum4;
    switch(): AssetType;
  }

  export abstract class AbstractAssetAlphaNum<TAssetCode extends Void | AssetCode4 | AssetCode12 = Void | AssetCode4 | AssetCode12> extends Struct {
    constructor(attributes: {
      assetCode: string,
      issuer: any,
    })
    assetCode(): TAssetCode;
    issuer(): any;
  }
  export class AssetAlphaNum4 extends AbstractAssetAlphaNum<AssetCode4> {
  }
  export class AssetAlphaNum12 extends AbstractAssetAlphaNum<AssetCode12> {
  }

  export class Memo extends Struct {
    static fromXDR(xdr: Buffer): Memo;
  }

  export class TransactionEnvelope extends Struct {
    static fromXDR(xdr: Buffer): TransactionEnvelope;
  }

  export class DecoratedSignature extends Struct {
    static fromXDR(xdr: Buffer): DecoratedSignature;

    constructor(keys: { hint: SignatureHint; signature: Signature });

    hint(): SignatureHint;
    signature(): Buffer;
  }

  export class PublicKeyTypeEd25519 extends Struct {
      constructor(somekindBuffer: Buffer);
  }
  export class AccountId extends Struct {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
  }
  export class PublicKey extends Struct {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
  }

  export type SignatureHint = Buffer;
  export type Signature = Buffer;

  export class TransactionResult extends Struct {
    static fromXDR(xdr: Buffer): TransactionResult;
  }
}

export default xdr
// export as namespace xdr
