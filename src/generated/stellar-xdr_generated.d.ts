import { Operation as BaseOperation } from '../operation';
import { Struct, Opaque, Void, Union, Hyper, UnsignedHyper, UnsignedInt, Int, VarOpaque, String as StringXDR, Bool, Option } from 'js-xdr';

declare namespace xdr {  // Primitives Void, Hyper, Int, Float, Double, Quadruple, Bool, String, Opaque, VarOpaque.

  export class Hash extends Opaque {}
  export class Uint256 extends Opaque {}
  export class Uint32 extends UnsignedInt {}
  export class Int32 extends Int {}
  export class Uint64 extends UnsignedHyper {}
  export class Int64 extends Hyper {}
  export class Thresholds extends Opaque {}
  export class String32 extends StringXDR {}
  export class String64 extends StringXDR {}
  export class SequenceNumber extends Int64 {}
  export class TimePoint extends Uint64 {}
  export class DataValue extends VarOpaque {}
  export class AssetCode4 extends Opaque {}
  export class AssetCode12 extends Opaque {}

  export class Asset extends Union {
    static fromXDR(input: Buffer, format?: 'raw'): Asset
    static fromXDR(input: string, format: 'hex' | 'base64'): Asset
    constructor(xdrTypeString: 'assetTypeCreditAlphanum4' | 'assetTypeCreditAlphanum12', xdrType: AssetAlphaNum4 | AssetAlphaNum12)
    static assetTypeNative(): Asset;
    alphaNum12(): AssetAlphaNum12;
    alphaNum4(): AssetAlphaNum4;
    switch(): AssetType;
  }

  export class AssetAlphaNum4 extends AbstractAssetAlphaNum<AssetCode4> {}
  export class AssetAlphaNum12 extends AbstractAssetAlphaNum<AssetCode12> {}

  export type SignatureHint = Buffer;
  export type Signature = Buffer;

}

declare namespace xdr {  // Array and VarArray.

  // TS-TODO: Can someone double check this achieve the same as https://github.com/stellar/js-stellar-base/blob/typescript/types/index.d.ts#L530 ?
  export class Operation<T extends BaseOperation = BaseOperation> extends Struct<AbstractAssetAlphaNum> {
    static fromXDR(input: Buffer, format?: 'raw'): Operation
    static fromXDR(input: string, format: 'hex' | 'base64'): Operation
    sourceAccount: Option<AccountId>
    body: OperationBody
  }

  export class AssetType extends Struct<AssetType> {
    static fromXDR(input: Buffer, format?: 'raw'): AssetType
    static fromXDR(input: string, format: 'hex' | 'base64'): AssetType
    static assetTypeNative(): AssetType;
    static assetTypeCreditAlphanum4(): AssetType;
    static assetTypeCreditAlphanum12(): AssetType;
    name: string;
  }
  export abstract class AbstractAssetAlphaNum<TAssetCode extends Void | AssetCode4 | AssetCode12 = Void | AssetCode4 | AssetCode12> extends Struct<AbstractAssetAlphaNum> {
    constructor(attributes: {
      assetCode: string,
      issuer: any,
    })
    assetCode(): TAssetCode;
    issuer(): any;
  }

  export class Memo extends Union {
    static fromXDR(input: Buffer, format?: 'raw'): Memo
    static fromXDR(input: string, format: 'hex' | 'base64'): Memo
    // switchOn: xdr.lookup("MemoType"),
    // switchName: "type",
    // switches: [
    //   ["memoNone", xdr.void()],
    //   ["memoText", "text"],
    //   ["memoId", "id"],
    //   ["memoHash", "hash"],
    //   ["memoReturn", "retHash"],
    // ],
    // arms: {
    //   text: xdr.string(28),
    //   id: xdr.lookup("Uint64"),
    //   hash: xdr.lookup("Hash"),
    //   retHash: xdr.lookup("Hash"),
    // },
  }

  export class TransactionEnvelope extends Struct<TransactionEnvelope> {
    static fromXDR(input: Buffer, format?: 'raw'): TransactionEnvelope
    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionEnvelope
  }
  type asdf<TAttributes extends object> = {[key in keyof TAttributes]: () => TAttributes[key]}

  export class DecoratedSignature extends Struct<DecoratedSignature> {
    static fromXDR(input: Buffer, format?: 'raw'): DecoratedSignature
    static fromXDR(input: string, format: 'hex' | 'base64'): DecoratedSignature
    hint(): SignatureHint
    signature(): Signature
  }

  export namespace DecoratedSignature {
    export interface IAttributes {
      hint: SignatureHint
      signature: Signature
    }
  }

  export class PublicKeyTypeEd25519 extends Struct<PublicKeyTypeEd25519> {
    static fromXDR(input: Buffer, format?: 'raw'): PublicKeyTypeEd25519
    static fromXDR(input: string, format: 'hex' | 'base64'): PublicKeyTypeEd25519
    constructor(somekindBuffer: Buffer);
  }

  export class Price extends Struct<Price> {}

  export class OperationBody extends Union {

  }

  export class PublicKey extends Union {
    static publicKeyTypeEd25519: typeof PublicKeyTypeEd25519
    // switchOn: xdr.lookup("PublicKeyType"),
    // switchName: "type",
    // switches: [
    //   ["publicKeyTypeEd25519", "ed25519"],
    // ],
    // arms: {
    //   ed25519: xdr.lookup("Uint256"),
    // },
  }
  export class AccountId extends PublicKey {}

  export class SignerKey extends Union {
    // switchOn: xdr.lookup("SignerKeyType"),
    // switchName: "type",
    // switches: [
    //   ["signerKeyTypeEd25519", "ed25519"],
    //   ["signerKeyTypePreAuthTx", "preAuthTx"],
    //   ["signerKeyTypeHashX", "hashX"],
    // ],
    // arms: {
    //   ed25519: xdr.lookup("Uint256"),
    //   preAuthTx: xdr.lookup("Uint256"),
    //   hashX: xdr.lookup("Uint256"),
    // },
  }


  export class TransactionResult extends Struct<TransactionResult> {
    static fromXDR(input: Buffer, format?: 'raw'): TransactionResult
    static fromXDR(input: string, format: 'hex' | 'base64'): TransactionResult
  }

  export class AllowTrustOpAsset extends Union {}

  export class AllowTrust extends Struct<AllowTrust> {}

}

declare namespace xdr {  // Operations
  export class CreateAccountOp extends Struct<CreateAccountOp> {
    destination: AccountId
    startingBalance: Int64
  }


  export class PaymentOp extends Struct<PaymentOp> {
    destination: AccountId
    asset: Asset
    amount: Int64
  }


  export class PathPaymentOp extends Struct<PathPaymentOp> {
    sendAsset: Asset
    sendMax: Int64
    destination: AccountId
    destAsset: Asset
    destAmount: Int64
    // ["path", xdr.varArray(xdr.lookup("Asset"), 5)],
  }

  export class ManageSellOfferOp extends Struct<ManageSellOfferOp> {
    selling: Asset
    buying: Asset
    amount: Int64
    price: Price
    offerId: Int64
  }


  export class ManageBuyOfferOp extends Struct<ManageBuyOfferOp> {
    selling: Asset
    buying: Asset
    buyAmount: Int64
    price: Price
    offerId: Int64
  }


  export class CreatePassiveSellOfferOp extends Struct<CreatePassiveSellOfferOp> {
    selling: Asset
    buying: Asset
    amount: Int64
    price: Price
  }


  export class SetOptionsOp extends Struct<SetOptionsOp> {
    inflationDest: AccountId
    clearFlags: Uint32
    setFlags: Uint32
    masterWeight: Uint32
    lowThreshold: Uint32
    medThreshold: Uint32
    highThreshold: Uint32
  }

  export class ChangeTrustOp extends Struct<ChangeTrustOp> {
    line: Asset
    limit: Int64
  }


  export class AllowTrustOp extends Struct<AllowTrustOp> {
    trustor: AccountId
    asset: AllowTrustOpAsset
    authorize: Bool
  }


  export class ManageDataOp extends Struct<ManageDataOp> {
    dataName: String64
    dataValue: DataValue
  }


  export class BumpSequenceOp extends Struct<BumpSequenceOp> {
    bumpTo: SequenceNumber
  }



}




export default xdr
// export as namespace xdr
